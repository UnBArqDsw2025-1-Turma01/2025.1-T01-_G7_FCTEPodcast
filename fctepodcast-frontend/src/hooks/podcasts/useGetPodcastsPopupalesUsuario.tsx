import { useEffect, useState } from "react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { PodcastType } from "../../utils/types/PodcastType";
import { addToast } from "@heroui/react";

export function useGetPodcastsPopularesUsuario(usuario_id: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [podcastsPopulares, setPodcastsPopulares] = useState<PodcastType[]>([]);

  const fetchPodcastsPopulares = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstace.get(
        `/usuario/perfil/${usuario_id}/populares`
      );
      setPodcastsPopulares(response.data.podcasts);
    } catch {
      addToast({
        title: "Erro ao buscar podcasts populares",
        description: "Não foi possível carregar os podcasts populares.",
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

    fetchPodcastsPopulares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario_id]);

  return { podcastsPopulares, loading, fetchPodcastsPopulares };
}
