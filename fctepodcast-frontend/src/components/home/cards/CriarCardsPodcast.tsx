import { Card, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PodcastType } from "../../../utils/types/PodcastType";
import { BASE_API_URL } from "../../../utils/constants";
import axios from "axios";
import { BiPlayCircle } from "react-icons/bi";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
  }),
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
};

const PodcastCard = ({
  podcast,
  onPress,
  index,
  ariaLabel,
}: {
  podcast: PodcastType;
  onPress?: () => void;
  index: number;
  ariaLabel?: string;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!podcast?.imagem_path) return;

    axios
      .get(
        `${BASE_API_URL}/usuario/image?path=${encodeURIComponent(
          podcast.imagem_path
        )}`,
        { responseType: "blob" }
      )
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setImageBlobUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        setImageBlobUrl(null);
      });

    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
  }, [podcast?.imagem_path]);

  // Acessibilidade: permite ativar o card via teclado (Enter ou Espaço),
  // garantindo interação para usuários que navegam pelo teclado.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onPress) {
      e.preventDefault();
      onPress();
    }
  };

  return (
    <motion.div
      // Animação e controle de visibilidade com framer-motion, sem impacto na acessibilidade.
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={variants}
      className="w-56 cursor-pointer"
      // Acessibilidade: define o papel como botão, pois o card é interativo.
      role="button"
      // Permite foco via teclado.
      tabIndex={0}
      // Fornece descrição acessível para leitores de tela, customizável via prop.
      aria-label={ariaLabel || `Ouvir podcast ${podcast.titulo} por ${podcast.autor.nome}`}
      onClick={onPress}
      onKeyDown={handleKeyDown}
    >
      <Card>
        {/* 
          Acessibilidade: a imagem usa alt text com o título do podcast, 
          para que leitores de tela possam compreender o conteúdo visual. 
        */}
        <Image
          src={imageBlobUrl || "/default-podcast.png"}
          alt={`Capa do podcast ${podcast.titulo}`}
          className="rounded-t-md"
          aria-hidden={false} // garante que leitores de tela lêem a descrição do alt
        />
        <CardBody>
          <h3 className="text-lg font-semibold">{podcast.titulo}</h3>
          <p className="text-sm text-gray-600">{podcast.autor.nome}</p>
          {/* Ícone visual para indicar função de "play" */}
          <BiPlayCircle
            aria-hidden="true" // ícones decorativos não devem ser lidos por leitores de tela
            className="text-4xl mt-2 text-blue-600"
          />
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PodcastCard;
