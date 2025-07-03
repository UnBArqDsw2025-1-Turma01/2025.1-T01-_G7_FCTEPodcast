import { Request, Response } from "express";
import { creatorRegistry } from "../factory/usuario/CreatorRegistry";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Episodio from "../models/Episodio";
import { Notificacao } from "../models/Notificacao";
import Podcast from "../models/Podcast";
import path from "path";
import fs from "fs";

export class UsuarioController {
  async getUsuarioById_Internal(id: string) {
    try {
      return await Usuario.findById(id);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }

  async getPerfilUsuario(req: Request, res: Response): Promise<void> {
    const usuarioId = req.params.usuario_id;

    if (!usuarioId) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "ID do usuário é obrigatório.",
      });
      return;
    }

    try {
      const usuario = await Usuario.findById(usuarioId);
      if (!usuario) {
        res.status(404).json({
          status: "error",
          title: "Usuário não encontrado",
          message: "Usuário com o ID fornecido não existe.",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        title: "Usuário encontrado",
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          profile_picture: usuario.profile_picture,
          cover_picture: usuario.cover_picture,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao buscar usuário.",
      });
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
          profile_picture: usuario.profile_picture,
          cover_picture: usuario.cover_picture,
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
          profile_picture: usuario.profile_picture,
          cover_picture: usuario.cover_picture,
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

  async getCurtidasUsuario(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params;
    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Usuário ID é obrigatório.",
      });
      return;
    }

    try {
      const usuario = await Usuario.findById(usuario_id).populate("curtidas");
      if (!usuario) {
        res.status(404).json({
          status: "error",
          title: "Usuário não encontrado",
          message: "Usuário com o ID fornecido não existe.",
        });
        return;
      }

      // Verifica se o usuário tem curtidas
      if (usuario.curtidas.length === 0) {
        res.status(200).json({
          status: "success",
          title: "Curtidas do Usuário",
          message: "Usuário não possui episódios curtidos.",
          curtidas: [],
        });
        return;
      }

      // pega o autor de cada episódio curtido
      // nunca fiz um codigo tao porco, mas é necessário
      const episodios_curtidos = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usuario.curtidas.map(async (curtida: any) => {
          const episodio = await Episodio.findById(curtida._id).populate(
            "podcast_reference"
          );
          const autor = await Usuario.findById(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (episodio?.podcast_reference as any).autor
          );
          if (!episodio) {
            console.error(`Episódio com ID ${curtida._id} não encontrado.`);
            return null;
          }
          return {
            _id: episodio._id,
            titulo: episodio.titulo,
            descricao: episodio.descricao,
            audio_path: episodio.audio_path,
            curtidas_count: episodio.curtidas_count,
            comentarios_count: episodio.comentarios_count,
            createdAt: episodio.createdAt,
            updatedAt: episodio.updatedAt,
            image_url: `${process.env.BASE_API_URL}/usuario/episodio/${episodio._id}/image`,
            autor: {
              _id: autor?._id,
              nome: autor?.nome || "Autor não informado",
              email: autor?.email || "Email não informado",
            },
          };
        })
      );

      res.status(200).json({
        status: "success",
        title: "Curtidas do Usuário",
        message: "Episódios curtidos encontrados com sucesso.",
        curtidas: episodios_curtidos,
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

  async getNotificacoes(req: Request, res: Response): Promise<void> {
    const usuario_id = req.params.usuario_id;
    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Usuário ID é obrigatório.",
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

      const notificacoes = await Notificacao.find({ destino: usuario_id })
        .sort({ createdAt: -1 })
        .populate({
          path: "origem",
          select: "_id nome email",
        })
        .populate({
          path: "destino",
          select: "_id nome email",
        })
        .populate({
          path: "episodio_referente",
          select: "_id titulo",
        });

      res.status(200).json({
        status: "success",
        title: "Notificações do Usuário",
        message: "Notificações encontradas com sucesso.",
        notificacoes: notificacoes,
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

  async visualizarNotificacoes(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params;
    const { ids } = req.body;

    if (!usuario_id || !ids || !Array.isArray(ids)) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Usuário ID e IDs de notificações são obrigatórios.",
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

      // Atualiza as notificações para lidas
      await Notificacao.updateMany(
        { _id: { $in: ids }, destino: usuario_id },
        { $set: { lida: true } }
      );

      res.status(200).json({
        status: "success",
        title: "Notificações visualizadas",
        message: "Notificações atualizadas para lidas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao atualizar notificações.",
      });
    }
  }

  async adicionarFotoDePerfil(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params;

    if (!req.file) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Arquivo de imagem é obrigatório.",
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

      usuario.profile_picture = req.file.path;
      await usuario.save();

      res.status(200).json({
        status: "success",
        title: "Foto de perfil atualizada",
        message: "Foto de perfil atualizada com sucesso.",
        usuarioAtualizado: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          profile_picture: usuario.profile_picture,
          cover_picture: usuario.cover_picture,
        },
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

  async getPodcastsPopulares(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Usuário ID é obrigatório.",
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

      // Busca os podcasts mais populares do usuário
      const podcastsPopulares = await Podcast.find({
        autor: usuario_id,
      })
        .sort({ reproducoes: -1 })
        .limit(4)
        .populate("co_autores", "_id nome email")
        .populate("autor", "_id nome email")
        .populate("episodios", "_id titulo descricao audio_path");

      res.status(200).json({
        status: "success",
        title: "Podcasts populares do usuário",
        message: "Podcasts populares encontrados com sucesso.",
        podcasts: podcastsPopulares,
      });
    } catch (error) {
      console.error("Erro ao buscar podcasts populares:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao buscar podcasts populares.",
      });
    }
  }

  async getPodcastsRecentes(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Usuário ID é obrigatório.",
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

      // Busca os podcasts mais recentes do usuário
      const podcastsRecentes = await Podcast.find({
        autor: usuario_id,
      })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate("co_autores", "_id nome email")
        .populate("autor", "_id nome email")
        .populate("episodios", "_id titulo descricao audio_path");

      res.status(200).json({
        status: "success",
        title: "Podcasts recentes do usuário",
        message: "Podcasts recentes encontrados com sucesso.",
        podcasts: podcastsRecentes,
      });
    } catch (error) {
      console.error("Erro ao buscar podcasts recentes:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao buscar podcasts recentes.",
      });
    }
  }

  async alterarFotoDePerfil(req: Request, res: Response): Promise<void> {
    const { usuario_id } = req.params;

    if (!req.file) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Arquivo de imagem é obrigatório.",
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
      if (usuario.profile_picture) {
        const caminhoAntigo = path.join("uploads", usuario.profile_picture);
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }

      const filepath_sem_uploads = req.file.path.replace(/^uploads\//, "");
      usuario.profile_picture = filepath_sem_uploads;
      await usuario.save();

      res.status(200).json({
        status: "success",
        title: "Foto de perfil alterada",
        message: "Foto de perfil alterada com sucesso.",
        usuarioAtualizado: {
          profile_picture: usuario.profile_picture,
        },
      });
    } catch (error) {
      console.error("Erro ao alterar foto de perfil:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao alterar foto de perfil.",
      });
    }
  }

  async getCriadores(req: Request, res: Response): Promise<void> {
    try {
      const criadores = await Usuario.find({ role: { $in: ["PROFESSOR"] } })
        .select("id nome email profile_picture cover_picture role")
        .sort({ createdAt: -1 });

      if (criadores.length === 0) {
        res.status(404).json({
          status: "error",
          title: "Nenhum criador encontrado",
          message: "Nenhum criador encontrado.",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        title: "Criadores encontrados",
        criadores: criadores,
      });
    } catch (error) {
      console.error("Erro ao buscar criadores:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message: "Erro ao buscar criadores.",
      });
    }
  }
}
