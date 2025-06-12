import { Avatar, Button, useDisclosure } from "@heroui/react";
import { useAuth } from "../../context/auth/AuthContext";
import CriarPodcastModal from "../../components/modals/podcast/CriarPodcastModal";

const Studio = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <div className="bg-primary h-40 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg" />
          <p className="font-bold">{user?.nome}</p>
        </div>
      </div>

      <div>
        <Button onPress={onOpen}>Criar Podcast</Button>
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
