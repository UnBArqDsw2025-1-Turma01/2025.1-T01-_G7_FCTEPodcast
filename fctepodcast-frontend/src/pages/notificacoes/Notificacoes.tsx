import { Divider } from "@heroui/react";
import { useNotifications } from "../../context/notifications/NotificationsContext";
import NotificacaoCard from "../../components/notificacao-card/NotificacaoCard";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const Notificacoes = () => {
  const { notifications } = useNotifications();
  return (
    <div className="h-screen w-full flex flex-col gap-4">
      <motion.h2
        className="font-bold text-2xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Notificações
      </motion.h2>

      <Divider />

      <div className="flex flex-col gap-4 pb-40">
        {notifications.length === 0 && (
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Nenhuma notificação encontrada.
          </motion.p>
        )}

        {notifications.map((notification, index) => (
          <AnimatePresence>
            <NotificacaoCard
              key={notification._id || index}
              notificacao={notification}
            />
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};

export default Notificacoes;
