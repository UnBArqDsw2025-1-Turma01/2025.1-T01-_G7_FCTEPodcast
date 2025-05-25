import { LoudlyCrying } from "../../components/animated-emojis/AnimatedEmojis";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.p
        className="italic"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        Ops...
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <LoudlyCrying />
      </motion.div>

      <motion.h1
        className="text-4xl font-bold"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-lg"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        Página não encontrada
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Button onPress={() => navigate(-1)}>
          Voltar à página anterior...
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
