import { Request, Response } from "express";
import { creatorRegistry } from "../factory/usuario/CreatorRegistry";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioController {
  async getUsuarioById_Internal(id: string) {
    try {
      return await Usuario.findById(id);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public hasPermission(usuario: any, allowedRoles: string[]): boolean {
    return !!usuario?.role && allowedRoles.includes(usuario.role);
  }

  async registrar(req: Request, res: Response): Promise<void> {
    const { nome, email, senha, role } = req.body;

    if (!role) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "O campo 'role' é obrigatório.",
      });
      return;
    }

    const creator = creatorRegistry[role];

    if (!creator) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: `O papel '${role}' não é suportado.`,
      });
      return;
    }

    try {
      await creator.create(nome, email, senha);
      res.status(201).json({
        status: "success",
        title: "Usuário criado com sucesso",
        message: `Usuário registrado com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao registrar usuário.",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Email e senha são obrigatórios.",
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
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("token").clearCookie("refreshToken").status(200).json({
      status: "ok",
      message: "Logout realizado com sucesso",
      title: "Logout",
    });
  }

  async refresh_session(req: Request, res: Response): Promise<void> {
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
      res.status(401).clearCookie("").json({
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
  }

  async checkLikedEpisodios(req: Request, res: Response): Promise<void> {
    const usuario_id = req.params.usuario_id;
    const episodio_id = req.params.episodio_id;
    if (!usuario_id || !episodio_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Usuário ID e Episódio ID são obrigatórios.",
      });
      return;
    }

    try {
      const usuario = await Usuario.findById(usuario_id);
      if (!usuario) {
        res.status(404).json({
          status: "error",
          title: "Usuário não encontrado",
          message: "Usuário com o ID fornecido não existe.",
        });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isLiked = usuario.curtidas.includes(episodio_id as any);

      res.status(200).json({
        status: "success",
        title: "Verificação de Episódio Curtido",
        setLiked: isLiked,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao buscar usuário.",
      });
      return;
    }
  }
}
