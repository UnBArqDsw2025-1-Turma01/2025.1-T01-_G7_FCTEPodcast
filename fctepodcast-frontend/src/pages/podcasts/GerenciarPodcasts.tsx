import { Button, Divider, useDisclosure } from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import CriarPodcastModal from "../../components/modals/podcast/CriarPodcastModal";
import PodcastStudioCard from "../../components/podcast-studio-card/PodcastStudioCard";

const GerenciarPodcasts = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Conteúdo do Perfil</h1>
        <Button onPress={onOpen} color="primary">
          <FaPlus />
          Adicionar Podcast
        </Button>
      </div>
      <Divider />

      <div>
        <p className="text-gray-500">
          Aqui você pode gerenciar seus podcasts, adicionar novos episódios e
          muito mais.
        </p>
      </div>

      <div className="flex justify-evenly items-center bg-primary-50 p-2 rounded-xl">
        <p>Dados do Podcast</p>
        <Divider orientation="vertical" className="h-8" />
        <p>Descrição</p>
        <Divider orientation="vertical" className="h-8" />
        <p>Ações</p>
      </div>

      <div className="flex flex-col gap-4">
        <PodcastStudioCard />

        <PodcastStudioCard />

        <PodcastStudioCard />
      </div>

      <CriarPodcastModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default GerenciarPodcasts;
