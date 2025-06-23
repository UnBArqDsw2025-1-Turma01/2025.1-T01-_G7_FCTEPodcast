import { useEffect, useState } from "react";
import type { EpisodioType } from "../../utils/types/EpisodioType";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { addToast, Image } from "@heroui/react";
import { BASE_API_URL, NO_IMAGE } from "../../utils/constants";
import { usePlayer } from "../../context/player/PlayerContext";
import { motion } from "framer-motion";

const EpisodioSmallCard = ({ episodio }: { episodio: EpisodioType }) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const { setPlaylist } = usePlayer();

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
      onClick={() => setPlaylist([episodio])}
    >
      <div className="flex items-center gap-4">
        <Image
          className="h-32 w-32"
          src={imageBlobUrl || NO_IMAGE}
          isLoading={!imageBlobUrl}
          alt={`Imagem do episódio ${episodio.titulo}`}
        />
        <div>
          <h2 className="font-bold">{episodio.titulo}</h2>
          <p>{episodio.autor.nome || "Não informado"}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodioSmallCard;
