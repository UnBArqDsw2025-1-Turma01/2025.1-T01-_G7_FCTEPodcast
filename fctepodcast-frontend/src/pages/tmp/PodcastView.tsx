import { useEffect, useState } from "react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { type PodcastType } from "../../utils/types/PodcastType";
import { usePlayer } from "../../context/player/PlayerContext";

const PodcastView = () => {
  const [podcasts, setPodcasts] = useState<PodcastType[]>([]);
  const { setPlaylist } = usePlayer();
  const get_podcasts = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.get("/usuario/tmp/podcasts");

      setPodcasts(response.data.podcasts);
    } catch (error) {
      console.error("Erro ao obter podcasts:", error);
    }
  };

  console.log("Podcasts:", podcasts);
  useEffect(() => {
    get_podcasts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-4">
        {podcasts.map((podcast) => (
          <div
            role="button"
            onClick={() => setPlaylist(podcast.episodios)}
            className="bg-content1 p-4"
            key={podcast._id}
          >
            <h2>{podcast.titulo}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastView;
