import { Request, Response } from "express";
import { ConcreteEpisodioBuilder } from "../builder/Episodio/EpisodioBuilder";
import Episodio from "../models/Episodio";
import Podcast from "../models/Podcast";
import path from "path";
import fs from "fs";
import { Usuario } from "../models/Usuario";
export class EpisodioController {
  async criarEpisodio(req: Request, res: Response): Promise<void> {
    const { titulo, descricao, podcast_reference } = req.body;
    const audio_file = req.file;

    const builder = new ConcreteEpisodioBuilder();

    try {
      await builder.adicionarCamposTextuais(titulo, descricao);
      if (!audio_file?.path) {
        throw new Error("Arquivo de áudio não foi fornecido.");
      }
      builder.adicionarAudio(audio_file.path);
      await builder.adicionarPodcastReferencia(podcast_reference);
      const episodio_dto = builder.build();

      const novo_episodio = await Episodio.create(episodio_dto);
      if (!novo_episodio) {
        res.status(500).json({
          status: "error",
          title: "Erro ao criar episódio",
          message: "Erro desconhecido ao criar o episódio.",
        });
        return;
      }

      const podcast_referencia = await Podcast.findById(
        novo_episodio.podcast_reference
      );
      if (!podcast_referencia) {
        res.status(404).json({
          status: "error",
          title: "Podcast não encontrado",
          message: "O podcast referenciado não foi encontrado.",
        });
        return;
      }

      podcast_referencia.episodios.push(novo_episodio._id);
      await podcast_referencia.save();

      res.status(201).json({
        status: "success",
        title: "Episódio criado com sucesso",
        message: "Episódio criado com sucesso!",
        data: novo_episodio,
      });
    } catch (error) {
      console.error("Erro ao criar episódio:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao criar o episódio.",
      });
      return;
    }
  }

  async getReferenceData(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(episodio.podcast_reference)
      .populate({
        path: "co_autores",
        select: "nome email",
      })
      .populate({
        path: "autor",
        select: "nome email",
      });
    if (!podcast) {
      res.status(404).json({
        status: "error",
        title: "Podcast não encontrado",
        message: "O podcast referenciado não foi encontrado.",
      });
      return;
    }

    res.status(200).json({
      imagem_path: podcast.imagem_path,
      reference_data: {
        autor: podcast.autor,
        titulo: podcast.titulo,
        descricao: podcast.descricao,
        tags: podcast.tags,
        autores: podcast.co_autores,
      },
    });
  }

  async getImage(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(episodio.podcast_reference);
    if (!podcast) {
      res.status(404).json({
        status: "error",
        title: "Podcast não encontrado",
        message: "O podcast referenciado não foi encontrado.",
      });
      return;
    }

    if (!podcast.imagem_path) {
      res.status(404).json({
        status: "error",
        title: "Imagem não encontrada",
        message: "O podcast não possui uma imagem associada.",
      });
      return;
    }

    // Corrigir o caminho da imagem
    const imagemPathStr =
      typeof podcast.imagem_path === "string" ? podcast.imagem_path : "";
    const absoluteImagePath = path.resolve(imagemPathStr);

    // Verificar se a imagem realmente existe
    if (!fs.existsSync(absoluteImagePath)) {
      res.status(404).json({
        status: "error",
        title: "Imagem não encontrada",
        message: "O caminho da imagem não é válido ou o arquivo não existe.",
      });
      return;
    }

    // Tentar enviar a imagem
    try {
      res.setHeader("Content-Type", "image/jpeg"); // ou ajuste conforme o tipo real da imagem
      res.sendFile(absoluteImagePath, (err) => {
        if (err) {
          console.error("Erro ao enviar imagem:", err);
          if (!res.headersSent) {
            res.status(500).json({
              status: "error",
              title: "Erro ao enviar imagem",
              message: "Erro desconhecido ao enviar a imagem do podcast.",
            });
          }
        }
      });
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      if (!res.headersSent) {
        res.status(500).json({
          status: "error",
          title: "Erro ao enviar imagem",
          message: "Erro desconhecido ao enviar a imagem do podcast.",
        });
      }
    }
  }

  async likeEpisodio(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;
    const { usuario_id } = req.body;

    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "O ID do usuário é obrigatório.",
      });
      return;
    }
    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      res.status(404).json({
        status: "error",
        title: "Usuário não encontrado",
        message: "O usuário referenciado não foi encontrado.",
      });
      return;
    }

    if (episodio.curtidas.includes(usuario.id)) {
      episodio.curtidas = episodio.curtidas.filter(
        (curtida) => curtida.toString() !== usuario.id.toString()
      );
      episodio.curtidas_count -= 1;
      usuario.curtidas = usuario.curtidas.filter(
        (curtida) => curtida.toString() !== episodio.id.toString()
      );
      try {
        await episodio.save();
        await usuario.save();

        res.status(200).json({
          status: "success",
          title: "Episódio descurtido com sucesso",
          message: "Você descurtiu o episódio com sucesso!",
          setLike: false,
        });
      } catch (error) {
        console.error("Erro ao descurtir episódio:", error);
        res.status(500).json({
          status: "error",
          title: "Erro interno do servidor",
          message:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao descurtir o episódio.",
        });
      }
      return;
    }

    episodio.curtidas.push(usuario.id);
    episodio.curtidas_count += 1;
    usuario.curtidas.push(episodio.id);

    try {
      await episodio.save();
      await usuario.save();

      res.status(200).json({
        status: "success",
        title: "Episódio curtido com sucesso",
        message: "Você curtiu o episódio com sucesso!",
        setLike: true,
      });
    } catch (error) {
      console.error("Erro ao curtir episódio:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao curtir o episódio.",
      });
    }
  }
}
