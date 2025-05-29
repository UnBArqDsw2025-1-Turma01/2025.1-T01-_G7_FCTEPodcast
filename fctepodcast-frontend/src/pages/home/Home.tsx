import PodcastCard from "../../components/home/cards/CriarCardsPodcast";
import AuthorCard from "../../components/home/cards/AutorCard";

const Home = () => {
  return (
  <div className="min-h-screen overflow-y-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Podcasts em Alta</h1>

      <div className="flex gap-6">
        <PodcastCard
          title="Calculo 01 - Introdução"
          subtitle="Novo Episódio"
          description="1 Episódio"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          onPress={() => alert("Você clicou em: Calculo 01 - Introdução")}
          index={0}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
      </div>

    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Criadores</h1>

      <div className="flex gap-6">
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
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Recomendações</h1>

        <div className="flex gap-6">
        <PodcastCard
          title="Calculo 01 - Introdução"
          subtitle="Novo Episódio"
          description="1 Episódio"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          onPress={() => alert("Você clicou em: Calculo 01 - Introdução")}
          index={0}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
        <PodcastCard
          title="Arquitetura de Software"
          subtitle="Recomendado"
          description="5 Episódios"
          imageUrl="https://heroui.com/images/hero-card-complete.jpeg"
          index={1}
        />
      </div>

      </div>
    </div>
  );
};

export default Home;


