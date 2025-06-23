import { Image } from "@heroui/react";
import minhas_curitdas_logo from "../../assets/curtidas/minhas_curtidas.png";
import { motion } from "framer-motion";

const PlaylistCard = ({
  title,
  type,
  total_episodios,
  onPress,
}: {
  title: string;
  type: string;
  total_episodios: number;
  onPress?: () => void;
}) => {
  // map de imagens
  const image_srcs: Record<string, string> = {
    curtidas: minhas_curitdas_logo,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "tween" }}
      layout
      className="flex items-center gap-4 bg-content1 p-3 rounded-xl cursor-pointer"
      onClick={onPress}
    >
      <Image className="w-28" src={image_srcs[type]} />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">{title}</p>
        <p>Total de episódios: {total_episodios}</p>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
