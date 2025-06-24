import { Button, Image, Spinner } from "@heroui/react";
import minhas_curtidas_logo from "../../assets/curtidas/minhas_curtidas.png";
import { FaPlay } from "react-icons/fa";
import { useParams } from "react-router";
import { useGetUsuarioCurtidas } from "../../hooks/curtidas/useGetUsuarioCurtidas";
import EpisodioSmallCard from "../../components/episodio-small-card/EpisodioSmallCard";
import { usePlayer } from "../../context/player/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  hidden: {},
};

const Curtidas = () => {
  const { usuario_id } = useParams();
  const { curtidas, loading } = useGetUsuarioCurtidas(usuario_id || "");
  const { setPlaylist } = usePlayer();

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="relative w-full h-[]30% overflow-hidden rounded-lg"
        variants={headerVariants}
      >
        {/* Fundo com blur usando div e background-image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-lg opacity-45"
          style={{ backgroundImage: `url(${minhas_curtidas_logo})` }}
        />

        {/* Conteúdo por cima */}
        <div className="flex gap-5 p-4 relative z-10">
          <Image className="w-48 h-48" src={minhas_curtidas_logo} />
          <div className="flex flex-col justify-center gap-2 text-white">
            <h2 className="font-bold text-2xl">Minhas curtidas</h2>
            <p>
              Veja todos os episódios que você curtiu. Clique em um episódio
              para ouvir novamente ou acessar mais detalhes.
            </p>

            <Button
              onPress={() => setPlaylist(curtidas, 0)}
              isIconOnly
              radius="full"
              color="primary"
            >
              <FaPlay />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 h-full w-full"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {loading && (
            <motion.div
              className="flex justify-center items-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Spinner size="lg" />
            </motion.div>
          )}

          {!loading && curtidas.length === 0 && (
            <motion.div
              className="flex justify-center items-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-500">
                Você ainda não curtiu nenhum episódio.
              </p>
            </motion.div>
          )}

          {!loading &&
            curtidas.length > 0 &&
            curtidas.map((episodio, index) => (
              <EpisodioSmallCard
                key={index}
                episodio={episodio}
                setPlaylist={() => setPlaylist(curtidas, index)}
              />
            ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Curtidas;
