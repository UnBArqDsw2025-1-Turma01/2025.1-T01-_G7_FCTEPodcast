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

    try {
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
      refresh();
    } catch (error: any) {
      addToast({
        title: "Erro ao criar podcast",
        description: error.response.data.message,
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      {/* O componente Modal deve automaticamente aplicar role="dialog" e aria-modal="true" para acessibilidade */}
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h1>Criar Podcast</h1>
              {/* Título do modal — geralmente é lido por leitores de tela ao abrir */}
            </ModalHeader>

            <ModalBody>
              <div className="flex items-center justify-center mb-4">
                {image ? (
                  <Image
                    src={URL.createObjectURL(image)}
                    className="h-40 w-40"
                    alt="Pré-visualização da imagem selecionada"
                    // `alt` torna a imagem compreensível para leitores de tela
                  />
                ) : (
                  <div
                    className="flex items-center justify-center h-40 w-40 bg-gray-200 rounded-lg"
                    aria-label="Pré-visualização da imagem"
                  >
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
                  aria-label="Imagem do podcast"
                  // Garante que o input de arquivo tenha um rótulo acessível
                />

                <Input
                  label="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
                {/* Campo com rótulo visível e legível por leitores de tela */}

                <Textarea
                  type="textarea"
                  label="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
                {/* Mesmo que um <textarea> nativo, com rótulo acessível */}

                <Input
                  label="Tags"
                  placeholder="Separe as tags com uma vírgula (,)"
                  onChange={(e) => setTags(e.target.value)}
                  value={tags}
                />

                <Input
                  label="Autor"
                  readOnly
                  disabled
                  value={user?.nome}
                  aria-readonly="true"
                />
                {/* Campo desabilitado, com `aria-readonly` adicional para reforçar acessibilidade */}

                <Button type="submit" color="primary">
                  Criar Podcast
                </Button>
                {/* Botão com rótulo textual claro, acessível por padrão */}
              </form>
            </ModalBody>

            <ModalFooter>
              {/* Footer vazio, mas mantém estrutura semântica */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CriarPodcastModal;
