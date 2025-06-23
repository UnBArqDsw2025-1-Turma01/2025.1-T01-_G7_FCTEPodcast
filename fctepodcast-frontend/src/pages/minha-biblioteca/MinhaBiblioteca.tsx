import { Divider } from "@heroui/react";
import FilterBadge from "../../components/filter-badge/FilterBadge";
import PlaylistCard from "../../components/playlist-card/PlaylistCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";

const MinhaBiblioteca = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <motion.div
      className="w-full h-full flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="font-bold text-2xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Sua Biblioteca
      </motion.h2>

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <FilterBadge content="Playlists" />
        <FilterBadge content="Professores" />
      </motion.div>

      <Divider />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col gap-4 w-full h-full overflow-y-auto p-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <PlaylistCard
          title="Minhas Curtidas"
          type="curtidas"
          total_episodios={10}
          onPress={() => navigate(`/curtidas/${user?.id}`)}
        />
      </motion.div>
    </motion.div>
  );
};

export default MinhaBiblioteca;
