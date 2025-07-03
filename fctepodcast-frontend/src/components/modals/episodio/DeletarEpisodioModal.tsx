import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import type { EpisodioType } from "../../../utils/types/EpisodioType";
import { FaTrash } from "react-icons/fa";
import { AxiosInstace } from "../../../utils/axios/AxiosInstance";

const DeletarEpisodioModal = ({
  isOpen,
  onOpenChange,
  episodio,
  refresh_function,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  episodio: EpisodioType;
  refresh_function: () => void;
}) => {
  const handleDelete = async () => {
    if (!episodio._id) {
      console.error("Episódio ID é necessário para a deleção.");
      return;
    }

    try {
      const response = await AxiosInstace.delete(
        `/usuario/episodio/${episodio._id}`
      );

      addToast({
        title: response.data.title || "Episódio deletado com sucesso",
        description:
          response.data.message || "O episódio foi deletado com sucesso.",
        color: "success",
      });

      refresh_function(); // Atualiza a lista
      onOpenChange(false); // Fecha o modal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: error.response?.data?.title || "Erro ao deletar episódio",
        description:
          error.response?.data?.message ||
          "Ocorreu um erro ao tentar deletar o episódio.",
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-center">
              <h2>Deletar Episódio "{episodio.titulo}"</h2>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center gap-4">
              <p>Essa ação é irreversível</p>
              <div className="flex gap-4">
                <Button
                  onPress={handleDelete}
                  color="danger"
                  className="text-white"
                >
                  <FaTrash />
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

export default DeletarEpisodioModal;
