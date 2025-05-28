import { Request, Response } from "express";
import Podcast from "../models/Podcast";
import { ConcretePodcastBuilder } from "../builder/Podcast/PodcastBuilder";

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
      });
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
}
