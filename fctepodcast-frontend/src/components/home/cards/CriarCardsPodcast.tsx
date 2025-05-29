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
}: {
  podcast: PodcastType;
  onPress?: () => void;
  index: number;
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

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
    >
      <Card
        isPressable
        shadow="sm"
        onPress={onPress}
        className="w-56 h-80 group relative flex flex-col items-center pt-4"
      >
        {/* Wrapper da imagem */}
        <div className="relative w-[200px] h-[200px]">
          <Image
            alt="cover"
            src={
              imageBlobUrl ||
              "https://heroui.com/images/hero-card-complete.jpeg"
            }
            width={200}
            height={200}
            className="rounded-xl object-cover w-full h-full"
          />

          {/* Ícone de play no hover */}
          <BiPlayCircle className="absolute bottom-2 right-2 text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg" />
        </div>

        {/* Conteúdo textual */}
        <CardBody className="flex flex-col gap-2 items-start justify-start text-start w-full px-4">
          <h2
            className="font-bold text-sm truncate w-full"
            title={podcast.titulo}
          >
            {podcast.titulo}
          </h2>
          <p className="text-sm truncate w-full" title={podcast.autor.nome}>
            {podcast.autor.nome}
          </p>
          <p className="text-xs italic break-words w-full max-h-10 overflow-hidden">
            {podcast.tags.join(", ")}
          </p>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PodcastCard;
