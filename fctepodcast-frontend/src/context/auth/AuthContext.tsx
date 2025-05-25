import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import type { UserType } from "../../utils/types/UserType";
import { addToast } from "@heroui/react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import Loader from "../../pages/loader/Loader";
import { useNavigate } from "react-router";

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const login = async (email: string, senha: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post("/usuario/login", {
        email,
        senha,
      });
      setUser(response.data.usuario);

      addToast({
        title: response.data.title,

        color: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response.data.title,
        description: error.response.data.message,
        color: "danger",
      });
      throw new Error(error);
    }
  };

  const logout = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post("/usuario/logout");
      setUser(null);
      addToast({
        title: response.data.title,
        color: "success",
        description: response.data.message,
      });
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: "Erro ao fazer logout",
        description:
          "Verifique sua conexão com a internet, ou tente novamente mais tarde.",
        color: "danger",
      });
      throw new Error(error);
    }
  };

  const refresh_session = async () => {
    setLoading(true);

    try {
      console.log("Refreshing session");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post("/usuario/refresh");
      setUser(response.data.usuario);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      addToast({
        title: error.response.data.title,
        description: error.response.data.message,
        color: "danger",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh_session();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
