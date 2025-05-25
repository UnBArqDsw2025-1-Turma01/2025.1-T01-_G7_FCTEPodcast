import { Request, Response } from "express";
import { Usuario } from "../../../models/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { title } from "process";

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({
      status: "error",
      title: "Campos obrigatórios",
      message: "Email e senha são obrigatórios",
    });
    return;
  }

  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    res.status(404).json({
      status: "error",
      title: "Usuário não encontrado",
      message: "Email ou senha incorretos",
    });
    return;
  }

  const validSenha = await bcrypt.compare(senha, usuario.senha);
  if (!validSenha) {
    res.status(401).json({
      status: "error",
      title: "Senha incorreta",
      message: "Email ou senha incorretos",
    });
    return;
  }

  const access_token = jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      role: usuario.role,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );
  const refresh_token = jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      role: usuario.role,
    },
    process.env.JWT_REFRESH_SECRET_KEY || "REFRESH",
    {
      expiresIn: "7d",
    }
  );

  res
    .status(200)
    .cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    })
    .cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800000, // 7 days
    })
    .json({
      status: "success",
      title: "Login realizado com sucesso",
      message: "Parabéns, você está logado!",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
};
