import { useEffect, useState } from "react";
import type { PodcastType } from "../../utils/types/PodcastType";
import { addToast } from "@heroui/react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";

export function useGetPodcastsUsuario(usuario_id: string) {
  const [podcasts, setPodcasts] = useState<PodcastType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.get(
        `/usuario/podcasts/${usuario_id}`
      );

      setPodcasts(response.data.podcasts);

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

    fetchPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario_id]);

  return { podcasts, loading, fetchPodcasts };
}
