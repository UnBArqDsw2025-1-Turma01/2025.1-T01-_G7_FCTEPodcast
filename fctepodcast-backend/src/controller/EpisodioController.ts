import { Request, Response } from "express";
import { ConcreteEpisodioBuilder } from "../builder/Episodio/EpisodioBuilder";
import Episodio from "../models/Episodio";
import Podcast from "../models/Podcast";
import path from "path";
import fs from "fs";
import { Usuario } from "../models/Usuario";
import Comentario from "../models/Comentario";
import { Notificacao } from "../models/Notificacao";
import { user_connections } from "../app";
import { io } from "../app";

export class EpisodioController {
  async criarEpisodio(req: Request, res: Response): Promise<void> {
    const { titulo, descricao, podcast_reference } = req.body;
    const audio_file = req.file;

    const builder = new ConcreteEpisodioBuilder();

    try {
      await builder.adicionarCamposTextuais(titulo, descricao);
      if (!audio_file?.path) {
        throw new Error("Arquivo de áudio não foi fornecido.");
      }
      builder.adicionarAudio(audio_file.path);
      await builder.adicionarPodcastReferencia(podcast_reference);
      const episodio_dto = builder.build();

      const novo_episodio = await Episodio.create(episodio_dto);
      if (!novo_episodio) {
        res.status(500).json({
          status: "error",
          title: "Erro ao criar episódio",
          message: "Erro desconhecido ao criar o episódio.",
        });
        return;
      }

      const podcast_referencia = await Podcast.findById(
        novo_episodio.podcast_reference
      );
      if (!podcast_referencia) {
        res.status(404).json({
          status: "error",
          title: "Podcast não encontrado",
          message: "O podcast referenciado não foi encontrado.",
        });
        return;
      }

      await novo_episodio.save();

      podcast_referencia.episodios.push(novo_episodio._id);
      await podcast_referencia.save();

      res.status(201).json({
        status: "success",
        title: "Episódio criado com sucesso",
        message: "Episódio criado com sucesso!",
        data: novo_episodio,
      });
    } catch (error) {
      console.error("Erro ao criar episódio:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao criar o episódio.",
      });
      return;
    }
  }

  async getReferenceData(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(episodio.podcast_reference)
      .populate({
        path: "co_autores",
        select: "id nome email",
      })
      .populate({
        path: "autor",
        select: "id nome email",
      });
    if (!podcast) {
      res.status(404).json({
        status: "error",
        title: "Podcast não encontrado",
        message: "O podcast referenciado não foi encontrado.",
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (podcast as any).reproducoes += 1;

    try {
      await podcast.save();
    } catch (error) {
      console.error("Erro ao atualizar reproduções do podcast:", error);
      res.status(500).json({
        status: "error",
        title: "Erro ao atualizar reproduções",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao atualizar as reproduções do podcast.",
      });
      return;
    }

    res.status(200).json({
      imagem_path: podcast.imagem_path,
      reference_data: {
        autor: podcast.autor,
        titulo: podcast.titulo,
        descricao: podcast.descricao,
        tags: podcast.tags,
        autores: podcast.co_autores,
      },
    });
  }

  async getImage(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(episodio.podcast_reference);
    if (!podcast) {
      res.status(404).json({
        status: "error",
        title: "Podcast não encontrado",
        message: "O podcast referenciado não foi encontrado.",
      });
      return;
    }

    if (!podcast.imagem_path) {
      res.status(404).json({
        status: "error",
        title: "Imagem não encontrada",
        message: "O podcast não possui uma imagem associada.",
      });
      return;
    }

    // Corrigir o caminho da imagem
    const imagemPathStr =
      typeof podcast.imagem_path === "string" ? podcast.imagem_path : "";
    const absoluteImagePath = path.resolve(imagemPathStr);

    // Verificar se a imagem realmente existe
    if (!fs.existsSync(absoluteImagePath)) {
      res.status(404).json({
        status: "error",
        title: "Imagem não encontrada",
        message: "O caminho da imagem não é válido ou o arquivo não existe.",
      });
      return;
    }

    // Tentar enviar a imagem
    try {
      res.setHeader("Content-Type", "image/jpeg"); // ou ajuste conforme o tipo real da imagem
      res.sendFile(absoluteImagePath, (err) => {
        if (err) {
          console.error("Erro ao enviar imagem:", err);
          if (!res.headersSent) {
            res.status(500).json({
              status: "error",
              title: "Erro ao enviar imagem",
              message: "Erro desconhecido ao enviar a imagem do podcast.",
            });
          }
        }
      });
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      if (!res.headersSent) {
        res.status(500).json({
          status: "error",
          title: "Erro ao enviar imagem",
          message: "Erro desconhecido ao enviar a imagem do podcast.",
        });
      }
    }
  }

  async likeEpisodio(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;
    const { usuario_id } = req.body;

    if (!usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "O ID do usuário é obrigatório.",
      });
      return;
    }
    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      res.status(404).json({
        status: "error",
        title: "Usuário não encontrado",
        message: "O usuário referenciado não foi encontrado.",
      });
      return;
    }

    if (episodio.curtidas.includes(usuario.id)) {
      episodio.curtidas = episodio.curtidas.filter(
        (curtida) => curtida.toString() !== usuario.id.toString()
      );
      episodio.curtidas_count -= 1;
      usuario.curtidas = usuario.curtidas.filter(
        (curtida) => curtida.toString() !== episodio.id.toString()
      );
      try {
        await episodio.save();
        await usuario.save();

        res.status(200).json({
          status: "success",
          title: "Episódio descurtido com sucesso",
          message: "Você descurtiu o episódio com sucesso!",
          setLike: false,
        });
      } catch (error) {
        console.error("Erro ao descurtir episódio:", error);
        res.status(500).json({
          status: "error",
          title: "Erro interno do servidor",
          message:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao descurtir o episódio.",
        });
      }
      return;
    }

    episodio.curtidas.push(usuario.id);
    episodio.curtidas_count += 1;
    usuario.curtidas.push(episodio.id);

    try {
      await episodio.save();
      await usuario.save();

      res.status(200).json({
        status: "success",
        title: "Episódio curtido com sucesso",
        message: "Você curtiu o episódio com sucesso!",
        setLike: true,
      });
    } catch (error) {
      console.error("Erro ao curtir episódio:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao curtir o episódio.",
      });
    }
  }

  async getEpisodio(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;

    const episodio = await Episodio.findById(episodio_id).populate({
      path: "comentarios",
      select: "conteudo usuario createdAt respostas",
      populate: [
        {
          path: "usuario",
          select: "nome email profile_picture",
        },
        {
          path: "respostas",
          select: "conteudo usuario createdAt",
          populate: {
            path: "usuario",
            select: "nome email profile_picture",
          },
        },
      ],
    });

    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(episodio.podcast_reference).populate(
      {
        path: "autor",
        select: "nome email",
      }
    );

    if (!podcast) {
      res.status(404).json({
        status: "error",
        title: "Podcast não encontrado",
        message: "O podcast referenciado não foi encontrado.",
      });
      return;
    }

    // Adiciona tags ao comentário e às respostas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comentarios = episodio.comentarios.map((comentario: any) => {
      const isAutor =
        podcast.autor &&
        comentario.usuario._id?.toString() ===
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (podcast.autor as any)._id?.toString();
      const isMonitor = podcast.co_autores?.includes(
        comentario.usuario._id?.toString()
      );

      let tag = "ouvinte";
      if (isAutor) tag = "autor";
      else if (isMonitor) tag = "monitor";

      const respostasComTag = (comentario.respostas || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (resposta: any) => {
          const isAutorResp =
            resposta.usuario._id?.toString() ===
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (podcast.autor as any)?._id.toString();
          const isMonitorResp = podcast.co_autores?.includes(
            resposta.usuario._id?.toString()
          );

          let tagResp = "ouvinte";
          if (isAutorResp) tagResp = "autor";
          else if (isMonitorResp) tagResp = "monitor";

          return {
            ...resposta.toObject(),
            tag: tagResp,
          };
        }
      );

      return {
        ...comentario.toObject(),
        tag,
        respostas: respostasComTag,
      };
    });

    res.status(200).json({
      status: "success",
      title: "Episódio encontrado",
      message: "Episódio encontrado com sucesso!",
      data: {
        _id: episodio._id,
        titulo: episodio.titulo,
        descricao: episodio.descricao,
        audio_path: episodio.audio_path,
        comentarios,
        comentarios_count: episodio.comentarios_count,
        curtidas: episodio.curtidas,
        curtidas_count: episodio.curtidas_count,
        podcast_reference: episodio.podcast_reference,
        imagem_path:
          typeof podcast.imagem_path === "string" ? podcast.imagem_path : "",
        autor: podcast.autor,
        podcast_titulo: podcast.titulo,
      },
    });
  }

  async adicionarComentario(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;
    const { conteudo, usuario_id } = req.body;

    if (!episodio_id || !conteudo || !usuario_id) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message: "Episódio ID, conteúdo e usuário ID são obrigatórios.",
      });
      return;
    }

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      res.status(404).json({
        status: "error",
        title: "Usuário não encontrado",
        message: "O usuário referenciado não foi encontrado.",
      });
      return;
    }

    const novo_comentario = await Comentario.create({
      conteudo,
      usuario: usuario._id,
      episodio: episodio._id,
    });
    if (!novo_comentario) {
      res.status(500).json({
        status: "error",
        title: "Erro ao criar comentário",
        message: "Erro desconhecido ao criar o comentário.",
      });
      return;
    }

    episodio.comentarios.push(novo_comentario._id);
    episodio.comentarios_count += 1;

    // adiciona a tag
    let tag: string = "";
    const podcast = await Podcast.findById(episodio.podcast_reference);
    const isAutor =
      podcast && podcast.autor
        ? podcast.autor.toString() === usuario.id
        : false;

    //  TODO: verificar se o usuario é monitor
    const isMonitor = podcast
      ? podcast.co_autores?.some((coAutor) => coAutor.toString() === usuario.id)
      : false;

    if (isAutor) {
      tag = "autor";
    } else if (isMonitor) {
      tag = "monitor";
    } else {
      tag = "ouvinte";
    }

    try {
      await episodio.save();

      const novaNotificacao = await Notificacao.create({
        origem: usuario._id,
        destino: podcast?.autor,
        tipo: "comentario",
        episodio_referente: episodio._id,
        conteudo: `Novo comentário no episódio "${episodio.titulo}" do podcast "${podcast?.titulo}"`,
      });

      const sockets = user_connections.get(podcast?.autor?.toString());
      if (sockets && sockets.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sockets.forEach((socketId: any) => {
          io.to(socketId).emit("nova_notificacao", {
            origem: {
              _id: usuario._id,
              nome: usuario.nome,
              email: usuario.email,
              profile_picture: usuario.profile_picture,
            },
            conteudo: novaNotificacao.conteudo,
            episodio_referente: {
              _id: episodio._id,
              titulo: episodio.titulo,
            },
            data: novaNotificacao.data,
            tipo: novaNotificacao.tipo,
            destino: podcast?.autor,
          });
        });
      }

      res.status(201).json({
        status: "success",
        title: "Comentário adicionado com sucesso",
        message: "Comentário adicionado com sucesso!",
        data: {
          _id: novo_comentario._id,
          conteudo: novo_comentario.conteudo,
          usuario: {
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
          },
          episodio: episodio._id,
          createdAt: novo_comentario.createdAt,
          tag: tag, // adiciona a tag ao comentário
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao adicionar o comentário.",
      });
    }
  }

  async responderComentario(req: Request, res: Response): Promise<void> {
    const { episodio_id, comentario_id } = req.params;
    const { usuario_id, conteudo } = req.body;
    if (!episodio_id || !comentario_id || !usuario_id || !conteudo) {
      res.status(400).json({
        status: "error",
        title: "Erro de validação",
        message:
          "Episódio ID, comentário ID, usuário ID e conteúdo são obrigatórios.",
      });
      return;
    }

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const comentario = await Comentario.findById(comentario_id);
    if (!comentario) {
      res.status(404).json({
        status: "error",
        title: "Comentário não encontrado",
        message: "O comentário referenciado não foi encontrado.",
      });
      return;
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      res.status(404).json({
        status: "error",
        title: "Usuário não encontrado",
        message: "O usuário referenciado não foi encontrado.",
      });
      return;
    }

    const resposta = await Comentario.create({
      conteudo,
      usuario: usuario._id,
      episodio: episodio._id,
    });

    comentario.respostas.push(resposta._id);
    episodio.comentarios_count += 1;

    // adiciona a tag
    let tag: string = "";
    const podcast = await Podcast.findById(episodio.podcast_reference);
    const isAutor =
      podcast && podcast.autor
        ? podcast.autor.toString() === usuario.id
        : false;

    //  TODO: verificar se o usuario é monitor
    const isMonitor = podcast
      ? podcast.co_autores?.some((coAutor) => coAutor.toString() === usuario.id)
      : false;

    if (isAutor) {
      tag = "autor";
    } else if (isMonitor) {
      tag = "monitor";
    } else {
      tag = "ouvinte";
    }

    try {
      await comentario.save();
      await episodio.save();

      res.status(201).json({
        status: "success",
        title: "Resposta adicionada com sucesso",
        message: "Resposta adicionada com sucesso!",
        data: {
          _id: resposta._id,
          conteudo: resposta.conteudo,
          usuario: {
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
            profile_picture: usuario.profile_picture,
          },
          tag: tag, // adiciona a tag à resposta
          episodio: episodio._id,
          createdAt: resposta.createdAt,
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar resposta:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao adicionar a resposta.",
      });
    }
  }

  async deletarEpisodio(req: Request, res: Response): Promise<void> {
    const { episodio_id } = req.params;
    if (!episodio_id) {
      res.status(400).json({
        status: "error",
        title: "ID de episódio ausente",
        message: "O ID do episódio é obrigatório.",
      });
      return;
    }

    const episodio = await Episodio.findById(episodio_id);
    if (!episodio) {
      res.status(404).json({
        status: "error",
        title: "Episódio não encontrado",
        message: "O episódio referenciado não foi encontrado.",
      });
      return;
    }

    const podcast = await Podcast.findById(episodio.podcast_reference);
    if (!podcast) {
      res.status(404).json({
        status: "error",
        title: "Podcast não encontrado",
        message: "O podcast referenciado não foi encontrado.",
      });
      return;
    }

    // Deletar o arquivo de áudio do episódio
    if (episodio.audio_path) {
      if (fs.existsSync(episodio.audio_path)) {
        fs.unlinkSync(episodio.audio_path);
      }
    }

    for (const comentarioId of episodio.comentarios) {
      const comentario = await Comentario.findById(comentarioId);

      if (comentario) {
        // Deletar todas as respostas de uma vez
        if (comentario.respostas && comentario.respostas.length > 0) {
          await Comentario.deleteMany({ _id: { $in: comentario.respostas } });
        }

        // Deletar o próprio comentário
        await Comentario.findByIdAndDelete(comentarioId);
      }
    }

    // Deletar o episódio do banco de dados
    try {
      await Episodio.findByIdAndDelete(episodio_id);
      podcast.episodios.pull(episodio_id);
      await podcast.save();

      res.status(200).json({
        status: "success",
        title: "Episódio deletado com sucesso",
        message: "Episódio deletado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao deletar episódio:", error);
      res.status(500).json({
        status: "error",
        title: "Erro interno do servidor",
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao deletar o episódio.",
      });
      return;
    }
  }
}
