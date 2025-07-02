import { Avatar, Button, useDisclosure } from "@heroui/react";
import { useAuth } from "../../context/auth/AuthContext";
import CriarPodcastModal from "../../components/modals/podcast/CriarPodcastModal";
import { getImageUrlFromPath } from "../../hooks/static/useImageFromPath";
import { useEffect, useState } from "react";

const Studio = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    async function fetchImage() {
      if (!user?.profile_picture) {
        setImageBlobUrl("");
        return;
      }

      try {
        const url = await getImageUrlFromPath(user.profile_picture);
        if (isActive) {
          setImageBlobUrl(url);
          objectUrl = url;
        } else {
          // Se já não está ativo, revoga a URL criada para evitar vazamento
          URL.revokeObjectURL(url);
        }
      } catch {
        if (isActive) {
          setImageBlobUrl("");
        }
      }
    }

    fetchImage();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user?.profile_picture]);

  return (
    <div>
      <div className="bg-primary h-40 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg" src={imageBlobUrl} />
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
