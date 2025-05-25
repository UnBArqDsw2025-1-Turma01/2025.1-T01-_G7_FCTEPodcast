import { Request, Response } from "express";
import { Professor } from "../../../models/Usuario";
import bcrypt from "bcryptjs";
import { title } from "process";

export const registrar_professor = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  const find_professor = await Professor.findOne({ email: email });
  if (find_professor) {
    res.status(409).json({
      status: "error",
      title: "Email já cadastrado",
      message: "Já existe um professor cadastrado com esse email",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const senha_hash = await bcrypt.hash(senha, salt);

  const novo_professor = await Professor.create({
    nome,
    email,
    senha: senha_hash,
    role: "PROFESSOR",
  });
  if (!novo_professor) {
    res.status(500).json({
      status: "error",
      title: "Erro Interno",
      message: "Erro ao registrar professor",
    });
    return;
  }

  res.status(201).json({
    status: "success",
    title: "Sucesso",
    message: "Professor registrado com sucesso",
  });
};
