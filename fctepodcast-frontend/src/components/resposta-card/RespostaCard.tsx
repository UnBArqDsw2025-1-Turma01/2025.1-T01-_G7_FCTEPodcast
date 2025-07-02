import { Avatar, Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import { getImageUrlFromPath } from "../../hooks/static/useImageFromPath";

type Tag = "autor" | "monitor" | "ouvinte";
type ColorType =
  | "success"
  | "warning"
  | "primary"
  | "default"
  | "secondary"
  | "danger";

const colorMap: Record<Tag, ColorType> = {
  autor: "success",
  monitor: "warning",
  ouvinte: "primary",
};

const iconMap: Record<Tag, React.ReactNode> = {
  autor: <FaGraduationCap size={18} />,
  monitor: <FaGraduationCap size={18} />,
  ouvinte: <FaBook size={18} />,
};

const RespostaCard = ({
  resposta,
}: {
  resposta: {
    conteudo: string;
    createdAt: string;
    tag: string;
    usuario: {
      _id: string;
      nome: string;
      email: string;
      __t: string; // Tipo de usuário, por exemplo, "ALUNO", "PROFESSOR", etc.
      profile_picture?: string; // Caminho para a imagem do perfil
    };
  };
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    async function fetchImage() {
      if (!resposta.usuario._id) {
        setImageBlobUrl("");
        return;
      }

      try {
        const url = await getImageUrlFromPath(resposta.usuario.profile_picture);
        if (isActive) {
          setImageBlobUrl(url);
          objectUrl = url;
        } else {
          // Se já não está ativo, revoga a URL criada para evitar vazamento
          URL.revokeObjectURL(url);
        }
      } catch {
        if (isActive) {
          setImageBlobUrl("");
        }
      }
    }

    fetchImage();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resposta.usuario._id, resposta.usuario.profile_picture]);

  console.log(resposta);
  return (
    <motion.div
      className="p-2 w-full flex justify-end"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-[100%] flex">
        {/* Linha da thread à esquerda */}
        <div className="w-4 flex justify-center">
          <div className="w-[3px] bg-gray-50 rounded-full h-full" />
        </div>

        {/* Conteúdo da resposta */}
        <div className="bg-primary-200 p-2 flex-1 flex flex-col gap-2 rounded-xl ml-2">
          <div className="flex gap-2 items-center mb-2">
            <Avatar size="lg" src={imageBlobUrl} />
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-bold">{resposta.usuario.nome}</p>
                  <p className="text-sm italic">{resposta.usuario.email}</p>
                </div>
                <Chip
                  startContent={iconMap[resposta.tag as Tag] || null}
                  variant="shadow"
                  color={colorMap[resposta.tag as Tag] || "default"}
                >
                  {resposta.tag.charAt(0).toUpperCase() + resposta.tag.slice(1)}
                </Chip>
              </div>
              <p className="text-sm text-gray-400">
                {resposta.createdAt
                  ? `${new Date(resposta.createdAt).toLocaleDateString(
                      "pt-BR"
                    )} às ${new Date(resposta.createdAt).toLocaleTimeString(
                      "pt-BR"
                    )}`
                  : "Data desconhecida"}
              </p>
            </div>
          </div>
          <p className="font-bold">Respondeu: </p>
          {resposta.conteudo}
        </div>
      </div>
    </motion.div>
  );
};

export default RespostaCard;
