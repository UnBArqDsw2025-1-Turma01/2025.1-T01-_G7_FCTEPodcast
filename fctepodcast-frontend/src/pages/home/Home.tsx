import PodcastCard from "../../components/home/cards/CriarCardsPodcast";
import AuthorCard from "../../components/home/cards/AutorCard";
import { usePlayer } from "../../context/player/PlayerContext";
import { Spinner } from "@heroui/react";
import { useGetPodcastsEmAlta } from "../../hooks/podcasts/useGetPodcastsEmAlta";

const Home = () => {
  // const { podcasts, loading } = useGetTodosPodcasts();
  const { podcasts, loading } = useGetPodcastsEmAlta();
  const { setPlaylist } = usePlayer();

  return (
    <div className="min-h-screen flex flex-col gap-12">
      <section>
        <h1 className="text-3xl font-semibold mb-4">Podcasts em Alta</h1>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide h-[21em] p-2">
          {loading && (
            <div className="flex items-center justify-center w-full">
              <Spinner size="lg" />
            </div>
          )}
          {podcasts.length > 0 &&
            podcasts.map((podcast, index) => (
              <PodcastCard
                podcast={podcast}
                index={index}
                onPress={() => setPlaylist(podcast.episodios)}
                key={podcast._id}
              />
            ))}
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-semibold mb-4">Criadores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AuthorCard
            name="Prof. João Silva"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="5 Podcasts"
          />
          <AuthorCard
            name="Dra. Ana Lima"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="8 Podcasts"
          />
          <AuthorCard
            name="Prof. Carlos Pereira"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="3 Podcasts"
          />
          <AuthorCard
            name="Dra. Letícia Mendes"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="4 Podcasts"
          />
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-semibold mb-4">Recomendações</h1>
        <div className="flex gap-6">{/* Recomendações futuras aqui */}</div>
      </section>
    </div>
  );
};

export default Home;
