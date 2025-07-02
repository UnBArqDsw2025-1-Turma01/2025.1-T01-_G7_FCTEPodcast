import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../utils/constants";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { PodcastType } from "../../utils/types/PodcastType";

export function useGetPodcastsRecentesUsuario(usuario_id: string) {
  const [podcastsRecentes, setPodcastsRecentes] = useState<PodcastType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcastsRecentes = async () => {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await AxiosInstace.get<PodcastType[]>(
          `${BASE_API_URL}/usuario/perfil/${usuario_id}/recentes`
        );
        setPodcastsRecentes(response.data.podcasts);
      } catch (err) {
        console.error("Error fetching recent podcasts:", err);
        setError("Failed to load recent podcasts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastsRecentes();
  }, [usuario_id]);

  return { podcastsRecentes, loading, error };
}
