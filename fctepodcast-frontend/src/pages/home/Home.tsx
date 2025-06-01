import PodcastCard from "../../components/home/cards/CriarCardsPodcast";
import AuthorCard from "../../components/home/cards/AutorCard";
import { useGetTodosPodcasts } from "../../hooks/podcasts/useGetTodosPodcasts";
import { usePlayer } from "../../context/player/PlayerContext";
import { Spinner } from "@heroui/react";

const Home = () => {
  const { podcasts, loading } = useGetTodosPodcasts();
  const { setPlaylist } = usePlayer();

  return (
    <div className="min-h-screen flex flex-col gap-12">
      {/* Acessibilidade: esta section está rotulada com um 'aria-label', informando que seu conteúdo é sobre 'Podcasts em alta'.
          Isso ajuda leitores de tela a entender o propósito da seção. */}
      <section aria-label="Podcasts em alta"> 
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
                // Acessibilidade: cada card recebe uma descrição clara via ariaLabel, indicando o título e autor do podcast.
                // Isso permite que usuários de leitores de tela entendam o conteúdo interativo antes de ativá-lo.
                ariaLabel={`Ouvir podcast ${podcast.titulo} por ${podcast.autor.nome}`}
                key={podcast._id}
              />
            ))}
        </div>
      </section>

      {/* Acessibilidade: esta seção representa criadores de conteúdo e está rotulada apropriadamente com 'aria-label'. */}
      <section aria-label="Criadores">
        <h1 className="text-3xl font-semibold mb-4">Criadores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Acessibilidade: cada AuthorCard recebe um ariaLabel descritivo com o nome do criador e quantidade de podcasts.
              Isso melhora a navegação com tecnologias assistivas. */}
          <AuthorCard
            name="Prof. João Silva"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="5 Podcasts"
            ariaLabel="Ver perfil do criador Prof. João Silva, 5 podcasts"
          />
          <AuthorCard
            name="Dra. Ana Lima"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="8 Podcasts"
            ariaLabel="Ver perfil da criadora Dra. Ana Lima, 8 podcasts"
          />
          <AuthorCard
            name="Prof. Carlos Pereira"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="3 Podcasts"
            ariaLabel="Ver perfil do criador Prof. Carlos Pereira, 3 podcasts"
          />
          <AuthorCard
            name="Dra. Letícia Mendes"
            imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
            description="4 Podcasts"
            ariaLabel="Ver perfil da criadora Dra. Letícia Mendes, 4 podcasts"
          />
        </div>
      </section>

      {/* Acessibilidade: mesmo sem conteúdo ainda, essa seção já possui um aria-label descritivo para garantir contexto
          a leitores de tela quando o conteúdo for adicionado. */}
      <section aria-label="Recomendações">
        <h1 className="text-3xl font-semibold mb-4">Recomendações</h1>
        <div className="flex gap-6">{/* Recomendações futuras aqui */}</div>
      </section>
    </div>
  );
};

export default Home;
