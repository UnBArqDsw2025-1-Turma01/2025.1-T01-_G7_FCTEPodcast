import { useEffect, useState } from "react";
import type { PodcastType } from "../../utils/types/PodcastType";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { addToast } from "@heroui/react";

export function useGetPodcastsEmAlta() {
  const [loading, setLoading] = useState<boolean>(true);
  const [podcasts, setPodcasts] = useState<PodcastType[]>([]);

  const fetchPodcastsEmAlta = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstace.get("/usuario/podcasts/em-alta");
      setPodcasts(response.data.podcasts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      console.log("Podcasts em alta:", response.data.podcasts);
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
    fetchPodcastsEmAlta();
  }, []);

  return { podcasts, loading, fetchPodcastsEmAlta };
}
