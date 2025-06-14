import type { ComentarioType } from "./ComentarioType";

export interface EpisodioType {
  _id: string;
  titulo: string;
  descricao: string;
  audio_path: string;
  comentarios: ComentarioType[];
  comentarios_count: number;
  curtidas: string[];
  curtidas_count: number;
  podcast_reference: string;
  imagem_path: string;
  autor: {
    _id: string;
    nome: string;
    email: string;
  };
}
