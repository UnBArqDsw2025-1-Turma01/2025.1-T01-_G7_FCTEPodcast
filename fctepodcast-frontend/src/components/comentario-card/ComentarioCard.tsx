import { useRef } from "react";
import type { ComentarioType } from "../../utils/types/ComentarioType";
import { Avatar, Button, Chip } from "@heroui/react";
import { FaBook, FaComment, FaGraduationCap } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import RespostaCard from "../resposta-card/RespostaCard";

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

const ComentarioCard = ({
  comentario,
  setResposta,
  setReferencia,
}: {
  comentario: ComentarioType;
  setResposta: (usuario_email: string) => void;
  setReferencia?: (referencia: string) => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-primary-100 p-4 rounded-xl flex flex-col gap-4"
    >
      <div className="flex gap-2   items-center">
        <Avatar size="lg" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <p className="font-bold">{comentario.usuario.nome}</p>
              <p className="italic text-sm">{comentario.usuario.email}</p>
            </div>
            <Chip
              startContent={iconMap[comentario.tag as Tag] || null}
              variant="shadow"
              color={colorMap[comentario.tag as Tag] || "default"}
            >
              {comentario.tag.charAt(0).toUpperCase() + comentario.tag.slice(1)}
            </Chip>
          </div>
          <p className="text-sm text-gray-400">
            {comentario.createdAt
              ? `${new Date(comentario.createdAt).toLocaleDateString(
                  "pt-BR"
                )} às ${new Date(comentario.createdAt).toLocaleTimeString(
                  "pt-BR"
                )}`
              : "Data desconhecida"}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <p className="whitespace-pre-wrap break-words">{comentario.conteudo}</p>
      </div>

      <div>
        <Button
          onPress={() => {
            setResposta(comentario.usuario.email);
            if (setReferencia) {
              setReferencia(comentario._id);
            }
          }}
          color="primary"
          size="sm"
        >
          <FaComment size={18} />
          Responder
        </Button>
      </div>
      <div className="w-full flex flex-col justify-end">
        {comentario.respostas &&
          comentario.respostas.length > 0 &&
          comentario.respostas.map((resposta, index: number) => (
            <RespostaCard key={index} resposta={resposta} />
          ))}
      </div>
    </motion.div>
  );
};

export default ComentarioCard;
