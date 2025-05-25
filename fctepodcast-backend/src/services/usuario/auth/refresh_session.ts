import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../../../models/Usuario";

export const refresh_session = async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    res.status(401).json({
      status: "error",
      message: "Refresh token não encontrado",
      title: "Erro ao atualizar sessão",
    });
    return;
  }

  const verify_refresh_token = (await jwt.verify(
    refresh_token,
    process.env.JWT_REFRESH_SECRET_KEY || "REFRESH"
  )) as jwt.JwtPayload;
  if (!verify_refresh_token) {
    res.status(401).json({
      status: "error",
      message: "Refresh token inválido",
      title: "Erro ao atualizar sessão",
    });
    return;
  }

  const usuario = await Usuario.findById(verify_refresh_token.id);
  if (!usuario) {
    res.status(404).json({
      status: "error",
      message: "Usuário não encontrado",
      title: "Erro ao atualizar sessão",
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

  res
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
    .status(200)
    .json({
      status: "success",
      message: "Sessão atualizada com sucesso",
      title: "Sessão atualizada com sucesso",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
};
