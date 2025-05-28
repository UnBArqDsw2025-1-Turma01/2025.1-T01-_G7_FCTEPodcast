import { RiClapperboardFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/auth/AuthContext";
import { FaPodcast } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { Avatar, Spacer } from "@heroui/react";
import type { JSX } from "react";

const StudioButtonLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    {
      title: "Gerenciar Podcasts",
      icon: <FaPodcast className="text-xl" />,
      redirect: "/studio/podcasts/gerenciar",
      reference_path: "/studio/podcasts/gerenciar",
    },
    {
      title: "Gerenciar Monitores",
      icon: <MdManageAccounts className="text-xl" />,
      redirect: "/studio/monitores/gerenciar",
      reference_path: "/studio/monitores/gerenciar",
    },
    {
      title: "Notificações",
      icon: <RiClapperboardFill className="text-xl" />,
      redirect: "/studio/notificacoes",
      reference_path: "/studio/notificacoes",
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
      <motion.div
        className="bg-primary p-2 rounded-xl flex flex-col gap-10"
        initial="hidden"
        animate="visible"
        variants={variants}
        custom={0}
      >
        <div className="flex items-center gap-4">
          <Avatar size="lg" />
          <div>
            <h2 className="text-xl font-bold">{user?.nome}</h2>
            <p className="text-sm text-gray-200">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 text-sm text-gray-200 gap-5">
          <p className="font-bold">Podcasts:</p>
          <p>Seguidores: 5</p>
        </div>
      </motion.div>
      <Spacer />
      {buttons.map(
        (
          btn: {
            title: string;
            icon: JSX.Element;
            redirect: string;
            reference_path: string;
          },
          i: number
        ) => (
          <motion.button
            key={btn.title}
            onClick={() => navigate(btn.redirect)}
            className={`p-5 w-full rounded-xl text-left flex flex-col gap-4 transition-colors duration-300 ${
              location.pathname.startsWith(btn.reference_path)
                ? "bg-primary-200"
                : "bg-primary-100"
            }`}
            variants={variants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={i + 1}
          >
            <h2 className="flex items-center gap-4 font-bold text-xl">
              {btn.icon}
              {btn.title}
            </h2>
          </motion.button>
        )
      )}
      <Spacer y={10} />

      <motion.button
        className="bg-primary-100 p-5 w-full rounded-xl text-left flex flex-col gap-4"
        onClick={() => navigate("/home")}
        variants={variants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        custom={buttons.length + 1}
      >
        <p className="flex items-center gap-4 font-bold text-xl">
          <IoIosArrowBack />
          Voltar
        </p>
      </motion.button>
    </div>
  );
};

export default StudioButtonLayout;
