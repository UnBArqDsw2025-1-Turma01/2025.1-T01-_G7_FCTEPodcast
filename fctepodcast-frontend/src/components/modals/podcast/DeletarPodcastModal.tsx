import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { AxiosInstace } from "../../../utils/axios/AxiosInstance";

const DeletarPodcastModal = ({
  isOpen,
  onOpenChange,
  podcast_id,
  refresh_function,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  podcast_id: string;
  refresh_function: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!podcast_id) {
      console.error("Podcast ID is required for deletion.");
      return;
    }

    setLoading(true);

    try {
      const response = await AxiosInstace.delete(
        `/usuario/podcast/${podcast_id}`
      );

      addToast({
        title: response.data.title || "Podcast deletado com sucesso",
        description:
          response.data.message || "O podcast foi deletado com sucesso.",
        color: "success",
      });

      refresh_function(); // Atualiza a lista após o modal fechar
      onOpenChange(false); // Fecha o modal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response?.data?.title || "Erro ao deletar podcast",
        description:
          error.response?.data?.message ||
          "Ocorreu um erro ao tentar deletar o podcast.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-center">
              <h2>Atenção!</h2>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center gap-4">
              <h2>Tem certeza que deseja deletar esse Podcast?</h2>
              <p className="">Essa ação é irreversível</p>
              <div className="flex gap-4">
                <Button
                  isLoading={loading}
                  onPress={handleDelete}
                  color="danger"
                  className="text-white"
                >
                  Deletar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Cancelar
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeletarPodcastModal;
