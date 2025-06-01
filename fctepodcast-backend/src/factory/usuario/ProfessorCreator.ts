import { Professor } from "../../models/Usuario";
import { UsuarioCreator } from "./UsuarioCreator";
import bcrypt from "bcryptjs";

// Classe concreta que implementa o factoryMethod para criar um Professor
// faz a criação do Professor com a senha criptografada
// e define o papel como "PROFESSOR"
// O ProfessorCreator é uma classe concreta que estende a classe abstrata UsuarioCreator
// e implementa o método factoryMethod para criar um Professor específico.
// Ele encapsula a lógica de criação de um Professor, incluindo a criptografia da senha.
export class ProfessorCreator extends UsuarioCreator {
  async factoryMethod(
    nome: string,
    email: string,
    senha: string
  ): Promise<void> {
    if (await Professor.findOne({ email: email })) {
      throw new Error("Já existe um professor com este email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const new_professor = await Professor.create({
      nome,
      email,
      senha: hashedPassword,
      role: "PROFESSOR",
    });

    if (!new_professor) {
      throw new Error("Erro ao criar professor");
    }

    console.log("Professor criado com sucesso:", new_professor);
  }
}
