import { Avatar, Button, useDisclosure } from "@heroui/react";
import { useAuth } from "../../context/auth/AuthContext";
import CriarPodcastModal from "../../components/modals/podcast/CriarPodcastModal";

const Studio = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    // Define o container principal da página para leitores de tela como conteúdo principal
    <div role="main" className="p-4">
      <div className="bg-primary h-40 rounded-xl p-4">
        {/* Agrupa avatar e nome do usuário com uma descrição acessível para leitores de tela */}
        <div
          className="flex items-center gap-4"
          aria-label={`Avatar e nome do usuário ${user?.nome}`}
        >
          {/* Adiciona descrição alternativa ao avatar para tecnologias assistivas */}
          <Avatar size="lg" alt={`Foto do usuário ${user?.nome}`} />
          <p className="font-bold">{user?.nome}</p>
        </div>
      </div>

      <div className="mt-4">
        {/* Botão com aria-label para explicitar sua ação para leitores de tela */}
        <Button onPress={onOpen} aria-label="Abrir modal para criar podcast">
          Criar Podcast
        </Button>
      </div>

      <CriarPodcastModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refresh={() => {}}
      />
    </div>
  );
};

export default Studio;
