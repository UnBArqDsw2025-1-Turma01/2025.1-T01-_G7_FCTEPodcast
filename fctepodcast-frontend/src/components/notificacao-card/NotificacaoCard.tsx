import type { NotificationType } from "../../utils/types/NotificationType";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckDouble } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useNotifications } from "../../context/notifications/NotificationsContext";

const NotificacaoCard = ({
  notificacao,
}: {
  notificacao: NotificationType;
}) => {
  const navigate = useNavigate();
  const { visualizarNotificacoes } = useNotifications();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !notificacao.lida) {
      visualizarNotificacoes([notificacao._id]);
    }
  }, [inView, notificacao._id, visualizarNotificacoes, notificacao.lida]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardBody>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <IoIosNotifications size={30} />
              <AnimatePresence mode="wait" initial={false}>
                {notificacao.lida ? (
                  <motion.div
                    key="lida"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    <Chip color="success" className="text-xs">
                      <p className="flex items-center gap-1">
                        <FaCheckDouble />
                        Lida
                      </p>
                    </Chip>
                  </motion.div>
                ) : (
                  <motion.div
                    key="nova"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    <Chip color="primary" className="text-xs ">
                      <p className="flex items-center gap-1 ">
                        <MdNewReleases />
                        Nova Notificação!
                      </p>
                    </Chip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <h3 className="font-bold">{notificacao.conteudo}</h3>
              <p>{notificacao.origem.nome} comentou!</p>
              <p className="text-sm text-gray-500">
                {new Date(notificacao.data).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                {" - "}
                {new Date(notificacao.data).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Button
              onPress={() =>
                navigate(`/${notificacao.episodio_referente?._id}/comentarios`)
              }
              color="primary"
            >
              Clique para ver
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default NotificacaoCard;
