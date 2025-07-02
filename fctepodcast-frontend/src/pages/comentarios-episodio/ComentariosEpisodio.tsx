import {
  addToast,
  Avatar,
  Button,
  Chip,
  Divider,
  Image,
  Input,
  Skeleton,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { EpisodioType } from "../../utils/types/EpisodioType";
import { fetchImage } from "../../utils/fetchImage";
import { BASE_API_URL } from "../../utils/constants";
import { FaComment } from "react-icons/fa";
import { useAuth } from "../../context/auth/AuthContext";
import ComentarioCard from "../../components/comentario-card/ComentarioCard";
import { AnimatePresence, motion } from "framer-motion";
import LoaderMini from "../loader/LoaderMini";
import { IoIosClose } from "react-icons/io";

const ComentariosEpisodio = () => {
  const { user } = useAuth();
  const { episodio_id } = useParams<{ episodio_id: string }>();
  const [episodio, setEpisodio] = useState<EpisodioType | null>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");
  const [textoComentario, setTextoComentario] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCampo, setLoadingCampo] = useState<boolean>(false);
  const ultimoComentarioRef = useRef<HTMLDivElement | null>(null);
  const [isResposta, setIsResposta] = useState<boolean>(false);
  const [respostaUsuarioEmail, setRespostaUsuarioEmail] = useState<string>("");
  const [referenciaComentario, setReferenciaComentario] = useState<string>("");

  const getEpisodioData = async () => {
    if (!episodio_id) {
      console.error("Episódio ID não fornecido.");
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.get(
        `/usuario/episodio/${episodio_id}`
      );

      setEpisodio(response.data.data);

      const image_request_url = `${BASE_API_URL}/usuario/episodio/${response.data.data?._id}/image`;

      await fetchImage(image_request_url)
        .then((blobUrl) => {
          setImageBlobUrl(blobUrl);
        })
        .catch((error) => {
          addToast({
            title: "Erro ao buscar imagem do episódio",
            description: error.message || "Erro desconhecido ao buscar imagem.",
          });
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response.data.title || "Erro ao obter dados do episódio",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!episodio_id || !textoComentario.trim()) {
      addToast({
        title: "Atenção",
        description: "Por favor, preencha o comentário.",
        color: "warning",
      });
      return;
    }

    try {
      setLoadingCampo(true);
      if (isResposta && !respostaUsuarioEmail) {
        addToast({
          title: "Erro",
          description: "Usuário não encontrado para resposta.",
          color: "danger",
        });
        return;
      }

      if (isResposta && respostaUsuarioEmail) {
        // tira <usuario_email> do início do texto
        const regex = new RegExp(`^<${respostaUsuarioEmail}>\\s*`);
        const conteudoLimpo = textoComentario.replace(regex, "").trim();
        if (!conteudoLimpo) {
          addToast({
            title: "Atenção",
            description: "O comentário não pode ser vazio.",
            color: "warning",
          });
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await AxiosInstace.post(
          `/usuario/episodio/${episodio?._id}/responder/${referenciaComentario}`,
          {
            conteudo: conteudoLimpo,
            usuario_id: user?.id,
          }
        );

        addToast({
          title: "Resposta adicionada com sucesso!",
          description: "Sua resposta foi adicionada ao comentário.",
          color: "success",
        });

        // Atualiza o episódio com a nova resposta
        setEpisodio((prev) => {
          if (prev) {
            return {
              ...prev,
              comentarios: prev.comentarios.map((comentario) => {
                if (comentario._id === referenciaComentario) {
                  return {
                    ...comentario,
                    respostas: [
                      ...comentario.respostas,
                      {
                        tag: response.data.data.tag || "resposta", // Adiciona a propriedade obrigatória 'tag'
                        _id: response.data.data._id,
                        conteudo: response.data.data.conteudo,
                        usuario: {
                          _id: response.data.data.usuario._id,
                          nome:
                            response.data.data.usuario.nome ||
                            "Usuário Anônimo",
                          email: response.data.data.usuario.email || "",
                          __t: response.data.data.usuario.__t || "ALUNO", // Tipo de usuário, por exemplo, "ALUNO", "PROFESSOR", etc.
                          profile_picture:
                            response.data.data.usuario.profile_picture || "",
                        },
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  };
                }
                return comentario;
              }),
            };
          }
          return prev;
        });
        setTextoComentario("");
        setIsResposta(false);
        setRespostaUsuarioEmail("");
        setReferenciaComentario("");

        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post(
        `/usuario/episodio/${episodio_id}/comentar`,
        { conteudo: textoComentario, usuario_id: user?.id }
      );

      addToast({
        title: "Comentário adicionado com sucesso!",
        description: "Seu comentário foi adicionado ao episódio.",
        color: "success",
      });
      setEpisodio((prev) => {
        if (prev) {
          return {
            ...prev,
            comentarios_count: prev.comentarios_count + 1, // Incrementa o contador de comentários
            comentarios: [
              ...prev.comentarios,
              {
                _id: response.data.data._id,
                usuario: {
                  _id: user?.id || "",
                  nome: user?.nome || "Usuário Anônimo",
                  email: user?.email || "",
                  profile_picture: user?.profile_picture || "",
                },
                conteudo: textoComentario,
                episodio: episodio_id,
                respostas: [],
                tag: response.data.data.tag || "", // Adiciona a propriedade obrigatória 'tag'
              },
            ],
          };
        }
        return prev;
      });
      setTextoComentario("");
      setTimeout(() => {
        ultimoComentarioRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response?.data?.title || "Erro ao adicionar comentário",
        description:
          error.response?.data?.message ||
          "Erro desconhecido ao adicionar comentário.",
        color: "danger",
      });
    } finally {
      setLoadingCampo(false);
    }
  };

  const handleSetResposta = (usuario_email: string) => {
    if (!usuario_email) {
      addToast({
        title: "Erro",
        description: "Usuário não encontrado para resposta.",
        color: "danger",
      });
      return;
    }

    const comentarioInput = document.getElementById(
      "comentario-input"
    ) as HTMLInputElement;

    setIsResposta(true);
    setRespostaUsuarioEmail(usuario_email);
    const texto = `<${usuario_email}> `;
    setTextoComentario(texto);
    setReferenciaComentario(usuario_email);

    // Espera o estado ser atualizado e o input estar visível
    setTimeout(() => {
      if (comentarioInput) {
        comentarioInput.scrollIntoView({ behavior: "smooth" });
        comentarioInput.focus();

        // Move o cursor para o final
        comentarioInput.setSelectionRange(texto.length, texto.length);
      }
    }, 100);
  };

  useEffect(() => {
    getEpisodioData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodio_id]);

  useEffect(() => {
    const regexEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    setIsResposta(regexEmail.test(textoComentario));
  }, [textoComentario]);

  return (
    <div className="h-full w-full flex flex-col gap-4">
      {/* Bloco do episódio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary-100 rounded-xl p-4 flex gap-4"
      >
        <div>
          <Image src={imageBlobUrl} isLoading={loading} className="h-28 w-28" />
        </div>
        {loading ? (
          <div className="flex flex-col gap-2 h-28 w-28">
            <Skeleton className="h-7 rounded-xl"></Skeleton>
            <Skeleton className="h-3 rounded-xl"></Skeleton>
            <Skeleton className="h-3 w-3/4 rounded-xl"></Skeleton>
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-2xl">{episodio?.titulo}</h2>
            <p>{episodio?.autor.nome}</p>
            <p className="italic">{episodio?.descricao}</p>
          </div>
        )}
      </motion.div>

      {/* Título Comentários */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="font-bold text-2xl"
      >
        Comentários
      </motion.h3>

      <Divider />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Lista de comentários */}

        {loading ? (
          <LoaderMini />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 w-full pb-20"
            >
              {episodio?.comentarios_count === 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-gray-500"
                >
                  Ainda não foram feitos comentários neste episódio. Seja o
                  primeiro(a)!
                </motion.p>
              )}

              <AnimatePresence>
                {episodio?.comentarios.map((comentario, index, array) => (
                  <motion.div
                    key={comentario._id}
                    ref={
                      index === array.length - 1 ? ultimoComentarioRef : null
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ComentarioCard
                      comentario={comentario}
                      setResposta={handleSetResposta}
                      setReferencia={setReferenciaComentario}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Barra de comentário flutuante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-primary-200/70 backdrop-blur-md p-2 rounded-xl flex gap-5 shrink-0
                 absolute bottom-2 left-0 right-0 z-10"
        >
          <Avatar />
          <form
            onSubmit={handleComentar}
            className="flex items-center gap-2 w-full"
          >
            <Input
              id="comentario-input"
              onChange={(e) => setTextoComentario(e.target.value)}
              value={textoComentario}
              placeholder="Adicionar comentário..."
              className="flex-1"
              startContent={
                <AnimatePresence>
                  {isResposta && respostaUsuarioEmail && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setTextoComentario("");
                        setIsResposta(false);
                        setRespostaUsuarioEmail("");
                      }}
                      style={{ display: "inline-flex" }} // para evitar problemas de inline-block
                    >
                      <Chip className="flex items-center gap-2">
                        <p className="flex items-center gap-2">
                          <IoIosClose size={16} />
                          Re:
                        </p>
                      </Chip>
                    </motion.button>
                  )}
                </AnimatePresence>
              }
            />
            <Button isLoading={loadingCampo} type="submit" color="primary">
              <FaComment size={20} />
              Comentar
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ComentariosEpisodio;
