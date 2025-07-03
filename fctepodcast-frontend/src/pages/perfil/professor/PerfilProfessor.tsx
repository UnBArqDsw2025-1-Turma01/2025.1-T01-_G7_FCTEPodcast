import { Divider } from "@heroui/react";
import PodcastCard from "../../../components/home/cards/CriarCardsPodcast";
import PodcastSmallCard from "../../../components/podcast-small-card/PodcastSmallCard";
import { usePlayer } from "../../../context/player/PlayerContext";
import { useGetPodcastsPopularesUsuario } from "../../../hooks/podcasts/useGetPodcastsPopupalesUsuario";
import { useGetPodcastsRecentesUsuario } from "../../../hooks/podcasts/useGetPodcastsRecentesUsuario";

const PerfilProfessor = ({ usuario_id }: { usuario_id: string }) => {
  const { podcastsPopulares } = useGetPodcastsPopularesUsuario(usuario_id);
  const { podcastsRecentes } = useGetPodcastsRecentesUsuario(usuario_id);
  const { setPlaylist } = usePlayer();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl">Podcasts Populares</h2>
      <div className="flex flex-col gap-4">
        {podcastsPopulares.length === 0 && (
          <p className="text-gray-500">Nenhum podcast popular encontrado.</p>
        )}
        {podcastsPopulares.length !== 0 &&
          podcastsPopulares.map((podcast, index: number) => (
            <>
              <PodcastSmallCard podcast={podcast} index={index + 1} />
              <Divider />
            </>
          ))}
      </div>
      <h2 className="font-bold text-2xl">Podcasts Recentes</h2>
      <div className="grid grid-cols-6 gap-4">
        {podcastsRecentes.length === 0 && (
          <p className="text-gray-500 col-span-7">
            Nenhum podcast recente encontrado.
          </p>
        )}
        {podcastsRecentes.length !== 0 &&
          podcastsRecentes.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              podcast={podcast}
              onPress={() => setPlaylist(podcast.episodios)}
              index={0}
            />
          ))}
      </div>
    </div>
  );
};

export default PerfilProfessor;
