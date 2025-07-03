import { addToast } from "@heroui/react";
import { useState, useEffect } from "react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { UserType } from "../../utils/types/UserType";

export function useGetCriadores() {
  const [loading, setLoading] = useState<boolean>(true);
  const [criadores, setCriadores] = useState<UserType[]>([]);

  const fetchCriadores = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstace.get("/usuario/criadores");
      setCriadores(response.data.criadores);
      console.log("Criadores fetched:", response.data.criadores);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response.data.title,
        description: error.response.data.description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriadores();
  }, []);

  return { criadores, loading, fetchCriadores };
}
