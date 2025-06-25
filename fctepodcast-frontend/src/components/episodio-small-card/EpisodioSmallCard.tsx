import { useEffect, useState } from "react";
import type { EpisodioType } from "../../utils/types/EpisodioType";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { addToast, Button, Image } from "@heroui/react";
import { BASE_API_URL, NO_IMAGE } from "../../utils/constants";
import { motion } from "framer-motion";
import { FaComment, FaHeart, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router";

const EpisodioSmallCard = ({
  episodio,
  setPlaylist,
}: {
  episodio: EpisodioType;
  setPlaylist: () => void;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  // const { setPlaylist } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!episodio?._id) return;

    const image_request_url = `${BASE_API_URL}/usuario/episodio/${episodio._id}/image`;

    let isMounted = true;
    let blobUrl: string | null = null;

    const fetchImage = async () => {
      try {
        const response = await AxiosInstace.get(image_request_url, {
          responseType: "blob",
        });
        if (!isMounted) return;
        blobUrl = URL.createObjectURL(response.data);
        setImageBlobUrl(blobUrl);
      } catch (error) {
        console.error("Erro ao buscar imagem:", error);
        addToast({
          title: "Erro ao carregar imagem",
          description: "Não foi possível carregar a imagem do episódio.",
          color: "danger",
        });
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [episodio?._id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-content1 p-4 rounded-2xl cursor-pointer hover:bg-content2 transition-colors duration-300"
      onClick={() => setPlaylist()}
    >
      <div className="flex items-center gap-4">
        <Image
          className="h-32 w-32"
          src={imageBlobUrl || NO_IMAGE}
          isLoading={!imageBlobUrl}
          alt={`Imagem do episódio ${episodio.titulo}`}
        />

        <div className="flex flex-col gap-2">
          <h2 className="font-bold">{episodio.titulo}</h2>
          <p>{episodio.autor.nome || "Não informado"}</p>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 flex gap-2 items-center">
              <FaHeart />
              {episodio.curtidas_count}
            </span>

            <span className="text-sm text-gray-500 flex gap-2 items-center">
              <FaComment />
              {episodio.comentarios_count}
            </span>
          </div>
        </div>

        <div className="ml-auto flex gap-5">
          <Button
            isIconOnly
            variant="shadow"
            color="primary"
            onPress={() => setPlaylist()}
          >
            <FaPlay />
          </Button>

          <Button
            isIconOnly
            variant="shadow"
            color="primary"
            onPress={() => navigate(`/${episodio._id}/comentarios`)}
          >
            <FaComment />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodioSmallCard;
