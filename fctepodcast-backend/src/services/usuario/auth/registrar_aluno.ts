import { Request, Response } from "express";
import { Aluno } from "../../../models/Usuario";
import bcrypt from "bcryptjs";

export const registrar_aluno = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  const find_aluno = await Aluno.findOne({
    email: email,
  });
  if (find_aluno) {
    res.status(409).json({
      status: "error",
      title: "Email já cadastrado",
      message: "Já existe um aluno cadastrado com esse email",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const senha_hash = await bcrypt.hash(senha, salt);

  const novo_aluno = await Aluno.create({
    nome,
    email,
    senha: senha_hash,
    role: "ALUNO",
  });

  if (!novo_aluno) {
    res.status(500).json({
      status: "error",
      title: "Erro Interno",
      message: "Erro ao registrar aluno",
    });
    return;
  }

  res.status(201).json({
    status: "success",
    title: "Sucesso",
    message: "Aluno registrado com sucesso",
  });
};
