import { Aluno } from "../../models/Usuario";
import { UsuarioCreator } from "./UsuarioCreator";
import bcrypt from "bcryptjs";

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
