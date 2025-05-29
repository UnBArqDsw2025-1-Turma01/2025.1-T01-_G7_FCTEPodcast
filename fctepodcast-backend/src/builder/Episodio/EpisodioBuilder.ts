import Podcast from "../../models/Podcast";

interface EpisodioBuilder {
  adicionarAudio(audio_path: string): void;
  adicionarCamposTextuais(titulo: string, descricao: string): void;
  adicionarPodcastReferencia(podcast_reference: string): Promise<void>;
  build(): EpisodioDTO;
}

type EpisodioDTO = {
  titulo: string;
  descricao: string;
  audio_path: string;
  podcast_reference: string;
};

export class ConcreteEpisodioBuilder implements EpisodioBuilder {
  private episodio: EpisodioDTO | null = null;

  constructor() {
    this.episodio = {
      titulo: "",
      descricao: "",
      audio_path: "",
      podcast_reference: "",
    };
  }

  public adicionarAudio(audio_path: string): void {
    if (!audio_path) {
      throw new Error(
        "Erro interno: Caminho do áudio não pode ser nulo ou indefinido."
      );
    }
    this.episodio!.audio_path = audio_path;
  }

  public adicionarCamposTextuais(titulo: string, descricao: string): void {
    if (!titulo) {
      throw new Error("Título não pode ser nulo ou indefinido.");
    }
    if (!descricao) {
      throw new Error("Descrição não pode ser nula ou indefinida.");
    }

    this.episodio!.titulo = titulo;
    this.episodio!.descricao = descricao;
  }

  public async adicionarPodcastReferencia(
    podcast_reference: string
  ): Promise<void> {
    if (!podcast_reference) {
      throw new Error("Referência do podcast não pode ser nula ou indefinida.");
    }

    const podcastExiste = await Podcast.findById(podcast_reference);
    if (!podcastExiste) {
      throw new Error("Podcast não encontrado.");
    }

    this.episodio!.podcast_reference = podcastExiste.id;
  }

  public build(): EpisodioDTO {
    if (!this.episodio) {
      throw new Error(
        "Erro interno: Episódio não foi inicializado corretamente."
      );
    }
    return this.episodio;
  }
}
