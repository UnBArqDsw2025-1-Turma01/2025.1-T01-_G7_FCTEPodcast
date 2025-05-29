import PodcastCard from "../../components/home/cards/CriarCardsPodcast";

const Home = () => {
  return (
    <div className="p-6">
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
    </div>
  );
};

export default Home;


