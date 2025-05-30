import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import type { PodcastType } from "../../../utils/types/PodcastType";
import React, { useState } from "react";
import { AxiosInstace } from "../../../utils/axios/AxiosInstance";

const CriarEpisodioModal = ({
  isOpen,
  onOpenChange,
  podcast_reference,
  fetch_function,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podcast_reference: PodcastType;
  fetch_function: () => void;
}) => {
  const [titulo, settitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [audio, setAudio] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCriarEpisodio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !descricao || !audio) {
      addToast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("audio", audio);
      formData.append("podcast_reference", podcast_reference._id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post(
        "/usuario/episodio/criar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetch_function();
      addToast({
        title: response.data.title,
        description: response.data.message,
        color: "success",
      });
      onOpenChange(false); // Fecha o modal após criar o episódio
      settitulo(""); // Limpa o título
      setDescricao(""); // Limpa a descrição
      setAudio(null); // Limpa o arquivo de áudio

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar episódio:", error);
      addToast({
        title: error.request.data.title,
        description: error.request.data.message,
        color: "danger",
      });
      return;
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
              <h2>Adicionar Episódio</h2>
            </ModalHeader>
            <ModalBody>
              <p>
                Adicionando ao Podcast:{" "}
                <span className="font-bold">{podcast_reference.titulo}</span>
              </p>
              <form
                onSubmit={handleCriarEpisodio}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Título"
                  onChange={(e) => settitulo(e.target.value)}
                />
                <Textarea
                  label="Descrição"
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <Input
                  type="file"
                  label="Áudio do Episódio"
                  accept="audio/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    setAudio(files && files.length > 0 ? files[0] : null);
                  }}
                />
                <div className="text-sm bg-content2 p-2 rounded-xl">
                  <p className="font-extrabold">Atenção!</p>
                  <p>São aceitos arquivos de áudio com:</p>
                  <ul className="list-disc pl-5">
                    <li>Formato: .MP3</li>
                    <li>Tamanho máximo: 100MB</li>
                  </ul>
                </div>

                {audio && (
                  <div className="text-sm bg-content2 p-2 rounded-xl">
                    <p>Preview do aúdio</p>
                    <audio
                      controls
                      className="w-full mt-2"
                      src={URL.createObjectURL(audio)}
                    >
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  </div>
                )}
                <Button isLoading={loading} type="submit" color="primary">
                  Adicionar Episódio
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CriarEpisodioModal;
