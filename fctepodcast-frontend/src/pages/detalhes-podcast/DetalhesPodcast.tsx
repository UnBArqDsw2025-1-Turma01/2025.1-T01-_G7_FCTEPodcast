import { addToast, Image } from "@heroui/react";
import { useParams } from "react-router";
import { useGetPodcastById } from "../../hooks/podcasts/useGetPodcastById";
import { NO_IMAGE } from "../../utils/constants";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { useEffect, useState } from "react";
import EpisodioSmallCard from "../../components/episodio-small-card/EpisodioSmallCard";
import { motion } from "framer-motion";
import { usePlayer } from "../../context/player/PlayerContext";

const DetalhesPodcast = () => {
  const { podcast_id } = useParams<{ podcast_id: string }>();
  const { podcast, loading } = useGetPodcastById(podcast_id || "");
  const [image_b64, setImage_b64] = useState<string | null>(null);
  const { setPlaylist } = usePlayer();

  const fileName = podcast?.imagem_path?.split("/").pop() || null;

  const get_image = async (fileName: string | null): Promise<string> => {
    if (!fileName) {
      return NO_IMAGE;
    }

    try {
      const response = await AxiosInstace.get(`/files/images/${fileName}`, {
        responseType: "arraybuffer",
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const contentType = response.headers["content-type"];
      const image = `data:${contentType};base64,${base64}`;

      return image;
    } catch (error) {
      console.error("Erro ao carregar imagem", error);
      addToast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível carregar a imagem do podcast.",
        color: "danger",
      });
      return NO_IMAGE;
    }
  };

  useEffect(() => {
    let isMounted = true;
    get_image(fileName).then((img) => {
      if (isMounted) setImage_b64(img);
    });
    return () => {
      isMounted = false;
    };
  }, [fileName]);

  console.log(podcast?.episodios);

  return (
    <motion.div
      className="flex flex-col gap-5 min-h-screen" // deixa crescer livremente e mínimo tela cheia
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Cabeçalho */}
      <motion.div
        className="relative rounded-xl h-[30%] flex items-center p-5 gap-5 overflow-hidden"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Fundo com imagem, blur e aspecto escurecido */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md scale-110 brightness-50"
          style={{ backgroundImage: `url(${image_b64 || NO_IMAGE})` }}
        />
        {/* Conteúdo acima do fundo */}
        <div className="relative flex items-center gap-5">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
          >
            <Image
              className="h-48 w-48"
              isLoading={loading}
              src={image_b64 || NO_IMAGE}
            />
          </motion.div>
          <motion.div
            className="flex flex-col gap-2 max-w-[70%] text-white"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.4 }}
          >
            <h1 className="font-bold text-xl shadow-sm">{podcast?.titulo}</h1>
            <p className="shadow-sm">{podcast?.autor.nome}</p>
            <div className="shadow-sm max-h-20 overflow-auto pr-2">
              {podcast?.descricao}
            </div>
            <p className="shadow-sm">{podcast?.episodios.length} Episódios</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Título fixo */}
      <motion.h2
        className="font-bold text-2xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.6 }}
      >
        Episódios
      </motion.h2>

      {/* Lista SEM scroll interno, cresce naturalmente */}
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.7,
            },
          },
        }}
      >
        {podcast?.episodios.length === 0 && (
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            Nenhum episódio encontrado.
          </motion.p>
        )}

        {podcast?.episodios.map((episodio, index) => (
          <>
            {console.log(index)}
            <EpisodioSmallCard
              setPlaylist={() => setPlaylist(podcast.episodios, index)}
              key={index}
              episodio={{
                ...episodio,
                autor: {
                  _id: "",
                  nome: podcast.autor.nome,
                  email: podcast.autor.email,
                },
              }}
            />
          </>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DetalhesPodcast;
