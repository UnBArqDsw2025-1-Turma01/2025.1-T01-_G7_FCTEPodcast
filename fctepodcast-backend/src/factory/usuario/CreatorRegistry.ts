import { AlunoCreator } from "./AlunoCreator";
import { ProfessorCreator } from "./ProfessorCreator";
import { UsuarioCreator } from "./UsuarioCreator";

export const creatorRegistry: Record<string, UsuarioCreator> = {
  ["PROFESSOR"]: new ProfessorCreator(),
  ["ALUNO"]: new AlunoCreator(),
};
