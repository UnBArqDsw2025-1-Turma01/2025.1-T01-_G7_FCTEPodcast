import Podcast from "../models/Podcast";

interface PodcastBuilder {
  cadastrarTag(): void;
  cadastrarAudio(): void;
  cadastrarImagem(image_path: string): void;
  cadastrarCamposTextuais(
    titulo: string,
    descricao: string,
    autores: string,
    convidado: string
  ): Promise<void>;
}

export class ConcretePodcastBuilder implements PodcastBuilder {
  private podcast_id: string | null = null;

  async cadastrarCamposTextuais(
    titulo: string,
    descricao: string,
    autores: string,
    convidado: string
  ): Promise<void> {
    const novo_podcasts = await Podcast.create({
      titulo: titulo,
      descricao: descricao,
      autores: autores,
      convidado: convidado,
    });

    if (!novo_podcasts) {
      throw new Error("Erro ao cadastrar o podcast");
    }

    this.podcast_id = novo_podcasts._id.toString();
  }

  async cadastrarImagem(image_path: string): Promise<void> {
    if (!this.podcast_id) {
        throw new Error("Podcast ID não definido. Cadastre os campos textuais primeiro.");
        }
    
        const podcast = await Podcast.findById(this.podcast_id);
        
    }
  }
}
