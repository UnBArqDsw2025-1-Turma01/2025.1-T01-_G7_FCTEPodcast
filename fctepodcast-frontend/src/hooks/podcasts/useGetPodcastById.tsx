import { useEffect, useState } from "react";
import type { PodcastType } from "../../utils/types/PodcastType";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { addToast } from "@heroui/react";

export function useGetPodcastById(podcast_id: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [podcast, setPodcast] = useState<PodcastType | null>(null);

  const fetchPodcast = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstace.get(`/usuario/podcast/${podcast_id}`);

      setPodcast(response.data.podcast);
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
    if (!podcast_id) {
      setLoading(false);
      return;
    }

    fetchPodcast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcast_id]);

  return { podcast, loading, fetchPodcast };
}
