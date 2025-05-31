import { AlunoCreator } from "./AlunoCreator";
import { ProfessorCreator } from "./ProfessorCreator";
import { UsuarioCreator } from "./UsuarioCreator";

// Registro de criadores de usuários
// Este objeto mapeia os tipos de usuários para suas respectivas classes criadoras.
// Ele permite que o sistema crie usuários de diferentes tipos sem precisar conhecer os detalhes de implementação de cada tipo.
// pega a implementação correta do criador de usuário com base no tipo de usuário

export const creatorRegistry: Record<string, UsuarioCreator> = {
  ["PROFESSOR"]: new ProfessorCreator(),
  ["ALUNO"]: new AlunoCreator(),
};
