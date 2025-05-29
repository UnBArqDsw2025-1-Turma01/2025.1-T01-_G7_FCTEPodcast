import { Card, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PodcastType } from "../../../utils/types/PodcastType";
import { BASE_API_URL } from "../../../utils/constants";
import axios from "axios";

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
    if (!podcast || !podcast.imagem_path) return;

    axios
      .get(
        `${BASE_API_URL}/usuario/image?path=${encodeURIComponent(
          podcast.imagem_path || ""
        )}`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setImageBlobUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        setImageBlobUrl(null);
      });

    // Cleanup ao desmontar o componente
    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="w-56 h-80 overflow-hidden"
      >
        <CardBody className="flex flex-col gap-4 items-center justify-center">
          <Image
            alt={`cover`}
            className="object-cover rounded-xl"
            src={
              imageBlobUrl ||
              "https://heroui.com/images/hero-card-complete.jpeg"
            }
            width={200}
            height={200}
          />
          <div className="flex flex-col items-start text-start justify-start w-full overflow-hidden">
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
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PodcastCard;
