import { Spinner } from "@heroui/react";
import { Peeking } from "../../components/animated-emojis/AnimatedEmojis";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Peeking />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Spinner size="lg" />
      </motion.div>

      <motion.p
        className="text-2xl font-bold"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        Carregando
        <span className="inline-block animate-bounce-dot [animation-delay:0ms]">
          .
        </span>
        <span className="inline-block animate-bounce-dot [animation-delay:200ms]">
          .
        </span>
        <span className="inline-block animate-bounce-dot [animation-delay:400ms]">
          .
        </span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        Aguarde, estamos deixando tudo pronto para você!
      </motion.p>
    </motion.div>
  );
};

export default Loader;
