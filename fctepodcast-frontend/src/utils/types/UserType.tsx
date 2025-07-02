export interface UserType {
  id: string;
  nome: string;
  email: string;
  role: "ALUNO" | "PROFESSOR";
  podcasts_seg: string[];
  profile_picture: string;
  cover_picture: string;
}
