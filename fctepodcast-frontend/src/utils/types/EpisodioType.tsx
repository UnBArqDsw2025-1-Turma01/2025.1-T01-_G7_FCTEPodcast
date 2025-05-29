export interface EpisodioType {
  _id: string;
  titulo: string;
  descricao: string;
  audio_path: string;
  comentarios: string[];
  comentarios_count: number;
  curtidas: string[];
  curtidas_count: number;
  podcast_reference: string;
}
