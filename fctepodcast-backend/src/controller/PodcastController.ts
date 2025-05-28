import { Request, Response } from "express";
import Podcast from "../models/Podcast";
import { ConcretePodcastBuilder } from "../builder/Podcast/PodcastBuilder";

export class PodcastController {
  async criarPodcast(req: Request, res: Response): Promise<void> {
    const { titulo, descricao, autor, co_autores } = req.body;
    const image_file = req.file;

    const builder = new ConcretePodcastBuilder();

    try {
      await builder.adicionarCamposTextuais(titulo, descricao, autor);
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
}
