import { useEffect, useState } from "react";
import { type PodcastType } from "../../utils/types/PodcastType";
import { addToast } from "@heroui/react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";

export function useGetTodosPodcasts() {
  const [podcasts, setPodcasts] = useState<PodcastType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPodcasts = async () => {
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responde: any = await AxiosInstace.get("/usuario/podcasts");

      setPodcasts(responde.data.podcasts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      addToast({
        title: err.response?.data?.title || "Erro",
        description:
          err.response?.data?.message ||
          "Ocorreu um erro ao buscar os podcasts.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return { podcasts, loading, fetchPodcasts };
}
