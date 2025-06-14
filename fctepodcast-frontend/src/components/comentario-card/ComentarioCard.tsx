import { useRef } from "react";
import type { ComentarioType } from "../../utils/types/ComentarioType";
import { Avatar, Button, Chip } from "@heroui/react";
import { FaBook, FaComment, FaGraduationCap } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

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

const ComentarioCard = ({ comentario }: { comentario: ComentarioType }) => {
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
      <div className="flex gap-3 items-center">
        <Avatar />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold">{comentario.usuario.nome}</p>
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
              ? new Date(comentario.createdAt).toLocaleDateString("pt-BR")
              : "Data desconhecida"}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <p className="whitespace-pre-wrap break-words">{comentario.conteudo}</p>
      </div>

      <div>
        <Button color="primary" size="sm">
          <FaComment size={18} />
          Responder
        </Button>
      </div>
    </motion.div>
  );
};

export default ComentarioCard;
