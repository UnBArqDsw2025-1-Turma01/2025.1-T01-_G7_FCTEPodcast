import { Professor } from "../../models/Usuario";
import { UsuarioCreator } from "./UsuarioCreator";
import bcrypt from "bcryptjs";

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
