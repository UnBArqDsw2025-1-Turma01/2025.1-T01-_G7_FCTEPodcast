import {
  RiFolderMusicFill,
  RiPlayListFill,
  RiClapperboardFill,
} from "react-icons/ri";
import { motion } from "framer-motion";

const SideBar = () => {
  const buttons = [
    {
      title: "Sua Biblioteca",
      description: "Organize, descubra e aproveite",
      icon: <RiFolderMusicFill className="text-xl" />,
    },
    {
      title: "Criar Playlist",
      description: "Organize conversas que te inspiram",
      icon: <RiPlayListFill className="text-xl" />,
    },
    {
      title: "Studio",
      description: "O backstage do seu conteúdo em áudio",
      icon: <RiClapperboardFill className="text-xl" />,
    },
  ];

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

  return (
    <div className="w-72 bg-primary-50 text-white p-4">
      <div className="w-full flex flex-col gap-4">
        {buttons.map((btn, i) => (
          <motion.button
            key={btn.title}
            className="bg-primary-100 p-5 w-full rounded-xl text-left flex flex-col gap-4"
            variants={variants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={i}
          >
            <h2 className="flex items-center gap-4 font-bold">
              {btn.icon}
              {btn.title}
            </h2>
            <p>{btn.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
