import { Request, Response } from "express";
import { Aluno, Professor } from "../../../../models/Usuario";
import bcrypt from "bcryptjs";

export const registrar_usuario = async (req: Request, res: Response) => {
  const { nome, email, senha, role } = req.body;

  if (!role) {
    res.status(400).json({
      status: "error",
      title: "Erro de validação",
      message: "O campo 'role' é obrigatório.",
    });
    return;
  }

  if (role === "ALUNO") {
    if (await Aluno.findOne({ email: email })) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Já existe um aluno cadastrado com esse email.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novo_aluno = await Aluno.create({
      nome,
      email,
      senha: senhaHash,
      role,
    });

    if (!novo_aluno) {
      res.status(500).json({
        status: "error",
        title: "Erro interno",
        message: "Erro ao criar o aluno.",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      title: "Aluno criado com sucesso",
      message: "Aluno criado com sucesso.",
    });
  }

  if (role === "PROFESSOR") {
    if (await Professor.findOne({ email: email })) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Já existe um professor cadastrado com esse email.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novo_professor = await Professor.create({
      nome,
      email,
      senha: senhaHash,
      role,
    });

    if (!novo_professor) {
      res.status(500).json({
        status: "error",
        title: "Erro interno",
        message: "Erro ao criar o professor.",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      title: "Professor criado com sucesso",
      message: "Professor criado com sucesso.",
    });
  }
};
