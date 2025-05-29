import { Request, Response } from "express";
import { ConcreteEpisodioBuilder } from "../builder/Episodio/EpisodioBuilder";
import Episodio from "../models/Episodio";
import Podcast from "../models/Podcast";

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
}
