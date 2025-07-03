import { Request, Response } from "express";
import Podcast from "../models/Podcast";
import { ConcretePodcastBuilder } from "../builder/Podcast/PodcastBuilder";
import fs from "fs";
import Episodio from "../models/Episodio";
import { Notificacao } from "../models/Notificacao";
import { io, user_connections } from "../app";
export class PodcastController {
  async criarPodcast(req: Request, res: Response): Promise<void> {
    const { titulo, descricao, autor, co_autores, tags } = req.body;
    const image_file = req.file;

    const builder = new ConcretePodcastBuilder();

    try {
      await builder.adicionarCamposTextuais(titulo, descricao, autor);
      await builder.registrarTags(tags);
      builder.adicionarImagem(image_file?.path);
      if (co_autores) {
        builder.adicionarCoAutores(co_autores);
      }

      const podcast_dto = builder.build();

      const novo_podcast = await Podcast.create(podcast_dto);

      if (!novo_podcast) {
        res.status(500).json({
          status: "error",
          title: "Erro ao criar podcast",
          message: "Erro desconhecido ao criar o podcast.",
        });
        return;
      }

      res.status(201).json({
        status: "success",
        title: "Podcast criado com sucesso",
        message: "Podcast criado com sucesso!",
        data: novo_podcast,
      });
    } catch (error) {
      console.error("Erro ao criar podcast:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao criar o podcast.",
      });
      return;
    }
  }

  async listarPodcastsUsuario(req: Request, res: Response): Promise<void> {
    const usuario_id = req.params.usuario_id;
    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "ID de usuário ausente",
        message: "O ID do usuário é obrigatório.",
      });
      return;
    }

    const podcasts = await Podcast.find({
      autor: usuario_id,
    })
      .populate({
        path: "co_autores",
        select: "nome email", // Seleciona apenas os campos necessários dos co-autores
      })
      .populate({
        path: "autor",
        select: "nome email", // Seleciona apenas os campos necessários do autor
      })
      .populate("episodios");
    if (!podcasts || podcasts.length === 0) {
      res.status(404).json({
        status: "error",
        title: "Nenhum podcast encontrado",
        message: "Nenhum podcast encontrado para este usuário.",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      title: "Podcasts encontrados",
      message: "Podcasts encontrados com sucesso!",
      podcasts: podcasts,
    });
  }

  async listarTodosPodcasts(req: Request, res: Response): Promise<void> {
    const podcasts = await Podcast.find()
      .populate({
        path: "autor",
        select: "nome email", // Seleciona apenas os campos necessários do autor
      })
      .populate("episodios");
    if (!podcasts || podcasts.length === 0) {
      res.status(404).json({
        status: "error",
        title: "Nenhum podcast encontrado",
        message: "Nenhum podcast encontrado.",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      title: "Podcasts encontrados",
      message: "Podcasts encontrados com sucesso!",
      podcasts: podcasts,
    });
  }

  async getPodcastById(req: Request, res: Response): Promise<void> {
    const podcastId = req.params.podcast_id;

    if (!podcastId) {
      res.status(400).json({
        status: "error",
        title: "ID de podcast ausente",
        message: "O ID do podcast é obrigatório.",
      });
      return;
    }

    try {
      const podcast = await Podcast.findById(podcastId)
        .populate({
          path: "autor",
          select: "nome email", // Seleciona apenas os campos necessários do autor
        })
        .populate("episodios");
      if (!podcast) {
        res.status(404).json({
          status: "error",
          title: "Podcast não encontrado",
          message: "Nenhum podcast encontrado com o ID fornecido.",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        title: "Podcast encontrado",
        message: "Podcast encontrado com sucesso!",
        podcast: podcast,
      });
    } catch (error) {
      console.error("Erro ao buscar podcast:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao buscar o podcast.",
      });
      return;
    }
  }

  async deletarPodcast(req: Request, res: Response): Promise<void> {
    const { podcast_id } = req.params;
    if (!podcast_id) {
      res.status(400).json({
        status: "error",
        title: "ID de podcast ausente",
        message: "O ID do podcast é obrigatório.",
      });
      return;
    }

    try {
      const podcast = await Podcast.findById(podcast_id).populate("episodios");
      if (!podcast) {
        res.status(404).json({
          status: "error",
          title: "Podcast não encontrado",
          message: "Nenhum podcast encontrado com o ID fornecido.",
        });
        return;
      }

      // Deletar episódios associados
      for (const episodio of podcast.episodios) {
        await Notificacao.deleteMany({
          episodio: episodio._id,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (fs.existsSync((podcast.episodios as any).audio_path as string)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fs.unlinkSync((podcast.episodios as any).audio_path as string);
        }
        await Episodio.findByIdAndDelete(episodio._id);
      }

      // Deletar imagem do podcast
      if (podcast.imagem_path) {
        if (fs.existsSync(podcast.imagem_path as string)) {
          fs.unlinkSync(podcast.imagem_path as string);
        }
      }

      // Deletar o próprio podcast
      await Podcast.findByIdAndDelete(podcast_id);

      const sockets = user_connections.get(podcast.autor?.toString());
      if (sockets && sockets.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sockets.forEach((socketId: any) => {
          io.to(socketId).emit("atualizar_notificacoes");
        });
      }

      res.status(200).json({
        status: "success",
        title: "Podcast deletado com sucesso",
        message: "Podcast deletado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao deletar podcast:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao deletar o podcast.",
      });
    }
  }

  async getPodcastsEmAlta(req: Request, res: Response): Promise<void> {
    const podcasts = await Podcast.find()
      .populate({
        path: "autor",
        select: "id nome email", // Seleciona apenas os campos necessários do autor
      })
      .populate("episodios");
    if (!podcasts || podcasts.length === 0) {
      res.status(404).json({
        status: "error",
        title: "Nenhum podcast encontrado",
        message: "Nenhum podcast encontrado.",
      });
      return;
    }

    // obtem a soma de reproducoes de todos os podcasts apartir das suas reproducoes
    const podcastsEmAlta = podcasts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => b.reproducoes - a.reproducoes)
      .slice(0, 10); // Pega os 10 podcasts mais reproduz

    res.status(200).json({
      status: "success",
      title: "Podcasts em alta",
      message: "Podcasts em alta encontrados com sucesso!",
      podcasts: podcastsEmAlta,
    });
  }
}
