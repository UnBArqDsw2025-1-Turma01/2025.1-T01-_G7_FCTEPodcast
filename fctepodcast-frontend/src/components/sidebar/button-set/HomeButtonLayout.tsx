import {
  RiFolderMusicFill,
  RiPlayListFill,
  RiClapperboardFill,
} from "react-icons/ri";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/auth/AuthContext";

const HomeButtonLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const buttons = [
    {
      title: "Sua Biblioteca",
      description: "Organize, descubra e aproveite",
      icon: <RiFolderMusicFill className="text-xl" />,
      redirect: "/home",
    },
    {
      title: "Criar Playlist",
      description: "Organize conversas que te inspiram",
      icon: <RiPlayListFill className="text-xl" />,
      redirect: "/home",
    },
    {
      title: "Studio",
      description: "O backstage do seu conteúdo em áudio",
      icon: <RiClapperboardFill className="text-xl" />,
      role_access: "PROFESSOR",
      redirect: "/studio/podcasts/gerenciar",
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
    <div className="w-full flex flex-col gap-4">
      {buttons
        .filter((btn) => !btn.role_access || btn.role_access === user?.role)
        .map((btn, i) => (
          <motion.button
            key={btn.title}
            onClick={() => navigate(btn.redirect)}
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
  );
};

export default HomeButtonLayout;
