import { Aluno } from "../../models/Usuario";
import { UsuarioCreator } from "./UsuarioCreator";
import bcrypt from "bcryptjs";

// Classe concreta que implementa o factoryMethod para criar um Aluno
// faz a criação do Aluno com a senha criptografada
// e define o papel como "ALUNO"
// O AlunoCreator é uma classe concreta que estende a classe abstrata UsuarioCreator
// e implementa o método factoryMethod para criar um Aluno específico.
// Ele encapsula a lógica de criação de um Aluno, incluindo a criptografia da senha.
// Isso permite que o sistema crie Alunos sem precisar conhecer os detalhes de implementação da criação de um Aluno.
export class AlunoCreator extends UsuarioCreator {
  async factoryMethod(
    nome: string,
    email: string,
    senha: string
  ): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const new_aluno = await Aluno.create({
      nome,
      email,
      senha: hashedPassword,
      role: "ALUNO",
    });

    if (!new_aluno) {
      throw new Error("Erro ao criar aluno");
    }

    console.log("Aluno criado com sucesso:", new_aluno);
  }
}
