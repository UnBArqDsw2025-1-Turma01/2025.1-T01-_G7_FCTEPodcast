import { createContext, useContext, useEffect, useState } from "react";
import type { NotificationType } from "../../utils/types/NotificationType";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../auth/AuthContext";
import { BASE_API_URL } from "../../utils/constants";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { addToast } from "@heroui/react";

interface NotificationContextType {
  notifications: NotificationType[];
  visualizarNotificacoes: (ids: string[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { user } = useAuth();

  const fetchNotificacoes = async () => {
    if (!user) return;

    try {
      const response = await AxiosInstace.get(
        `/usuario/notificacoes/${user.id}`
      );

      setNotifications(response.data.notificacoes);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao buscar notificações:", error);
      addToast({
        title: error.response.data.title,
        description: error.response.data.message,
        color: "danger",
      });
    }
  };
  useEffect(() => {
    if (!user) return;
    if (user.role !== "PROFESSOR") return;
    fetchNotificacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "PROFESSOR") return;

    const socket: Socket = io(BASE_API_URL.replace(/\/api\/?$/, ""), {
      path: "/socket",
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Conectado ao servidor de notificações");
      socket.emit("registar_usuario", user.id);
    });

    socket.on("nova_notificacao", (notification: NotificationType) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    socket.on("atualizar_notificacoes", () => {
      fetchNotificacoes();
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  console.log("Notificações:", notifications);

  const visualizarNotificacoes = async (ids: string[]) => {
    if (!user) return;

    try {
      await AxiosInstace.post(`/usuario/notificacoes/${user.id}/visualizar`, {
        ids,
      }).catch((error) => {
        console.error("Erro ao visualizar notificações:", error);
        addToast({
          title: "Erro",
          description: "Não foi possível visualizar as notificações.",
          color: "danger",
        });
      });

      // Atualiza o estado das notificações localmente
      setNotifications((prevNotifications) => {
        if (!ids || ids.length === 0) return prevNotifications;

        return prevNotifications.map((notification) =>
          ids.includes(notification._id)
            ? { ...notification, lida: true }
            : notification
        );
      });
    } catch (error) {
      console.error("Erro ao visualizar notificações:", error);
      addToast({
        title: "Erro",
        description: "Não foi possível visualizar as notificações.",
        color: "danger",
      });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        visualizarNotificacoes,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
