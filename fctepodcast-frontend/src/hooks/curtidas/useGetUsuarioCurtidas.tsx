import { useEffect, useState } from "react";
import { addToast } from "@heroui/react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { EpisodioType } from "../../utils/types/EpisodioType";

export function useGetUsuarioCurtidas(usuario_id: string) {
  const [curtidas, setCurtidas] = useState<EpisodioType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurtidas = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.get(
        `/usuario/${usuario_id}/curtidas`
      );
      setCurtidas(response.data.curtidas);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      addToast({
        title: err.response.data.title,
        description: err.response.data.message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!usuario_id) {
      setLoading(false);
      return;
    }

    fetchCurtidas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario_id]);

  return { curtidas, loading, fetchCurtidas };
}
