import type { EpisodioType } from "./EpisodioType";

export interface PodcastType {
  _id: string;
  titulo: string;
  imagem_path: string;
  descricao: string;
  co_autores: string[];
  autor: {
    nome: string;
    email: string;
  };
  episodios: EpisodioType[];
  tags: string[];
  createdAt: string;
  reproducoes: number;
}
