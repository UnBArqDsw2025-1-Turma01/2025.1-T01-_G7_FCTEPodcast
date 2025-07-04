import {
  addToast,
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import React, { useState } from "react";
import { useAuth } from "../../../context/auth/AuthContext";
import { AxiosInstace } from "../../../utils/axios/AxiosInstance";
import { BASE_API_URL } from "../../../utils/constants";

const CriarPodcastModal = ({
  isOpen,
  onOpenChange,
  refresh,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refresh: () => void;
}) => {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.nome === undefined) {
      console.error("Usuário não autenticado");
      return;
    }
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    if (image) {
      formData.append("image", image);
    }
    formData.append("autor", user?.id);
    formData.append("tags", tags);

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post(
        `${BASE_API_URL}/usuario/podcast/criar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      addToast({
        title: "Podcast criado com sucesso",
        description: response.data.message,
        color: "success",
      });
      onOpenChange(false);
      setTitulo("");
      setDescricao("");
      setImage(null);
      setTags("");

      refresh(); // Refresh the podcast list after creation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: "Erro ao criar podcast",
        description: error.response.data.message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h1>Criar Podcast</h1>
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-center mb-4">
                {image ? (
                  <Image
                    src={URL.createObjectURL(image)}
                    className="h-40 w-40"
                  />
                ) : (
                  <div className="flex items-center justify-center h-40 w-40 bg-gray-200 rounded-lg">
                    <p className="text-center text-foreground-50">
                      Nenhuma imagem selecionada
                    </p>
                  </div>
                )}
              </div>
              <form
                onSubmit={handleCreatePodcast}
                className="flex flex-col gap-4"
              >
                <Input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />

                <Input
                  label="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />

                <Textarea
                  type="textarea"
                  label="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />

                <Input
                  label="Tags"
                  placeholder="Separe as tags com uma vírgula (,)"
                  onChange={(e) => setTags(e.target.value)}
                  value={tags}
                />

                <Input label="Autor" readOnly disabled value={user?.nome} />

                <Button isLoading={loading} type="submit" color="primary">
                  Criar Podcast
                </Button>
              </form>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CriarPodcastModal;
