import {
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import type { PodcastType } from "../../../utils/types/PodcastType";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/constants";
import EpisodioStudioCard from "../../episodio-studio-card/EpisodioStudioCard";
import { motion } from "framer-motion";

const VerEpisodiosModal = ({
  isOpen,
  onOpenChange,
  podcast_reference,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  podcast_reference: PodcastType;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!podcast_reference.imagem_path) return;

    axios
      .get(
        `${BASE_API_URL}/usuario/image?path=${encodeURIComponent(
          podcast_reference.imagem_path
        )}`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setImageBlobUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        setImageBlobUrl(null);
      });

    // Cleanup ao desmontar o componente
    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcast_reference.imagem_path]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {() => (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ModalHeader>Episódios de {podcast_reference.titulo}</ModalHeader>
            </motion.div>

            <ModalBody>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex gap-4"
              >
                <Image src={imageBlobUrl || "no_image"} className="w-36" />
                <div>
                  <h2 className="font-bold">{podcast_reference.titulo}</h2>
                  <p>{podcast_reference.autor.nome}</p>
                  <p className="italic overflow-hidden break-words">
                    {podcast_reference.descricao}
                  </p>
                </div>
              </motion.div>

              <Divider />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-col gap-4 mt-4 max-h-96 overflow-y-auto pr-2"
              >
                {podcast_reference.episodios.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-gray-500"
                  >
                    Este podcast ainda não possui episódios.
                  </motion.p>
                )}

                {podcast_reference.episodios.map((episodio, i) => (
                  <motion.div
                    key={episodio._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <EpisodioStudioCard
                      episodio={episodio}
                      image_blob_url={imageBlobUrl}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default VerEpisodiosModal;
