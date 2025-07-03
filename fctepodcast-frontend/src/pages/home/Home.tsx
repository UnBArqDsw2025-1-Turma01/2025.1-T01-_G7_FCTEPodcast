import PodcastCard from "../../components/home/cards/CriarCardsPodcast";
import AuthorCard from "../../components/home/cards/AutorCard";
import { usePlayer } from "../../context/player/PlayerContext";
import { Spinner } from "@heroui/react";
import { useGetPodcastsEmAlta } from "../../hooks/podcasts/useGetPodcastsEmAlta";
import { useGetCriadores } from "../../hooks/usuario/useGetCriadores";

const Home = () => {
  // const { podcasts, loading } = useGetTodosPodcasts();
  const { podcasts, loading } = useGetPodcastsEmAlta();
  const { criadores, loading: loadingCriadores } = useGetCriadores();
  const { setPlaylist } = usePlayer();

  console.log("Podcasts em alta:", podcasts);
  console.log("Criadores:", criadores);

  return (
    <div className="min-h-screen flex flex-col gap-12">
      <section>
        <h1 className="text-3xl font-semibold mb-4">Podcasts em Alta</h1>
        <div className="grid grid-cols-6 gap-6 p-2">
          {loading && (
            <div className="flex items-center justify-center w-full col-span-6">
              <Spinner size="lg" />
            </div>
          )}
          {podcasts.length > 0 ? (
            podcasts.map((podcast, index) => (
              <PodcastCard
                podcast={podcast}
                index={index}
                onPress={() => setPlaylist(podcast.episodios)}
                key={podcast._id}
              />
            ))
          ) : (
            <p className="col-span-6 text-center text-gray-500">
              Nenhum podcast encontrado.
            </p>
          )}
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-semibold mb-4">Criadores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {!loadingCriadores &&
            criadores.map((criador) => (
              <AuthorCard criador={criador} key={criador.id} />
            ))}

          {loadingCriadores && (
            <div className="flex items-center justify-center w-full">
              <Spinner size="lg" />
            </div>
          )}
        </div>
      </section>

      {/* <section>
        <h1 className="text-3xl font-semibold mb-4">Recomendações</h1>
        <div className="flex gap-6"></div>
      </section> */}
    </div>
  );
};

export default Home;
