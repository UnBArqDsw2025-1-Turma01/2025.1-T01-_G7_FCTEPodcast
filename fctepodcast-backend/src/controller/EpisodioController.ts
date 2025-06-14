import { Request, Response } from "express";
import { ConcreteEpisodioBuilder } from "../builder/Episodio/EpisodioBuilder";
import Episodio from "../models/Episodio";
import Podcast from "../models/Podcast";
import path from "path";
import fs from "fs";
import { Usuario } from "../models/Usuario";
import Comentario from "../models/Comentario";
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

      await novo_episodio.save();

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

  async getEpisodio(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;

    const episodio = await Episodio.findById(episodio_id).populate({
      path: "comentarios",
      select: "conteudo usuario createdAt",
      populate: {
        path: "usuario",
        select: "nome email",
      },
    });

    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(
      episodio?.podcast_reference
    ).populate({
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

    // adicionar tags no comentario : ["ouvinte", "monitor", "autor"]
    const comentarios = episodio.comentarios.map((comentario: any) => {
      let tag: string = "";

      console.log("Comentário:", comentario);
      console.log("Usuário do comentário:", comentario.usuario);
      console.log("Autor do podcast:", podcast.autor);
      const isAutor =
        comentario.usuario._id?.toString() ===
        (podcast.autor as any)._id?.toString();
      const isMonitor = podcast.co_autores?.includes(comentario.usuario.id);

      if (isAutor) {
        tag = "autor";
      } else if (isMonitor) {
        tag = "monitor";
      } else {
        tag = "ouvinte";
      }

      return {
        ...comentario.toObject(),
        tag,
      };
    });

    res.status(200).json({
      status: "success",
      title: "Episódio encontrado",
      message: "Episódio encontrado com sucesso!",
      data: {
        _id: episodio._id,
        titulo: episodio.titulo,
        descricao: episodio.descricao,
        audio_path: episodio.audio_path,
        comentarios: comentarios,
        comentarios_count: episodio.comentarios_count,
        curtidas: episodio.curtidas,
        curtidas_count: episodio.curtidas_count,
        podcast_reference: episodio.podcast_reference,
        imagem_path:
          typeof podcast.imagem_path === "string" ? podcast.imagem_path : "",
        autor: podcast.autor,
        podcast_titulo: podcast.titulo,
      },
    });
  }

  async adicionarComentario(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;
    const { conteudo, usuario_id } = req.body;

    if (!episodio_id || !conteudo || !usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Episódio ID, conteúdo e usuário ID são obrigatórios.",
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

    const novo_comentario = await Comentario.create({
      conteudo,
      usuario: usuario._id,
      episodio: episodio._id,
    });
    if (!novo_comentario) {
      res.status(500).json({
        status: "error",
        title: "Erro ao criar comentário",
        message: "Erro desconhecido ao criar o comentário.",
      });
      return;
    }

    episodio.comentarios.push(novo_comentario._id);
    episodio.comentarios_count += 1;

    // adiciona a tag
    let tag: string = "";
    const podcast = await Podcast.findById(episodio.podcast_reference);
    const isAutor =
      podcast && podcast.autor
        ? podcast.autor.toString() === usuario.id
        : false;

    //  TODO: verificar se o usuario é monitor
    const isMonitor = podcast
      ? podcast.co_autores?.some((coAutor) => coAutor.toString() === usuario.id)
      : false;

    if (isAutor) {
      tag = "autor";
    } else if (isMonitor) {
      tag = "monitor";
    } else {
      tag = "ouvinte";
    }

    try {
      await episodio.save();

      res.status(201).json({
        status: "success",
        title: "Comentário adicionado com sucesso",
        message: "Comentário adicionado com sucesso!",
        data: {
          _id: novo_comentario._id,
          conteudo: novo_comentario.conteudo,
          usuario: {
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
          },
          episodio: episodio._id,
          createdAt: novo_comentario.createdAt,
          tag: tag, // adiciona a tag ao comentário
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao adicionar o comentário.",
      });
    }
  }
}
