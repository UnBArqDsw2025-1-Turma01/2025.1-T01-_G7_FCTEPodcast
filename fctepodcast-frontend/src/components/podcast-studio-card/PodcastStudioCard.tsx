import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  useDisclosure,
} from "@heroui/react";
import type { PodcastType } from "../../utils/types/PodcastType";
import { motion } from "framer-motion";
import { IoMdAdd } from "react-icons/io";
import { MdAudiotrack } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { BASE_API_URL, NO_IMAGE } from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import CriarEpisodioModal from "../modals/episodio/CriarEpisodioModal";
import VerEpisodiosModal from "../modals/episodio/VerEpisodiosModal";
import DeletarPodcastModal from "../modals/podcast/DeletarPodcastModal";

const PodcastStudioCard = ({
  podcast,
  fetch_function,
}: {
  podcast: PodcastType;
  fetch_function: () => void;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenVerEpisodios,
    onOpen: onOpenVerEpisodios,
    onOpenChange: onOpenChangeVerEpisodios,
  } = useDisclosure();

  useEffect(() => {
    if (!podcast.imagem_path) return;

    axios
      .get(
        `${BASE_API_URL}/usuario/image?path=${encodeURIComponent(
          podcast.imagem_path
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
  }, [podcast.imagem_path]);

  return (
    <>
      <motion.div
        className="bg-primary-50 p-4 rounded-xl flex items-center justify-evenly gap-6 shadow-sm h-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        //whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Image
              src={imageBlobUrl || NO_IMAGE}
              alt="Capa do Podcast"
              className="w-16 rounded-md"
            />
          </motion.div>

          <div>
            <p className="font-bold text-lg">{podcast.titulo}</p>
            <p className="text-sm text-gray-300">{podcast.autor.nome}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 text-sm text-gray-500 mt-2 line-clamp-2 overflow-hidden"
        >
          {podcast.descricao}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          {podcast.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button>Ver opões</Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={"adicionar"}>
                <button
                  onClick={onOpen}
                  className="flex items-center gap-2 w-full"
                >
                  <IoMdAdd />
                  Adicionar Episódio
                </button>
              </DropdownItem>
              <DropdownItem key={"ver"}>
                <button
                  onClick={onOpenVerEpisodios}
                  className="flex items-center gap-2 w-full"
                >
                  <MdAudiotrack />
                  Ver Episódios
                </button>
              </DropdownItem>
              <DropdownItem key={"editar"}>
                <button className="flex items-center gap-2 w-full">
                  <FaPencil />
                  Editar Podcast
                </button>
              </DropdownItem>
              <DropdownItem
                key={"excluir"}
                color="danger"
                className="text-danger"
                onPress={onOpenDelete}
              >
                <button className="flex items-center gap-2 w-full">
                  <FaTrash />
                  Excluir Podcast
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </motion.div>
      </motion.div>
      <CriarEpisodioModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        podcast_reference={podcast}
        fetch_function={fetch_function}
      />
      <VerEpisodiosModal
        isOpen={isOpenVerEpisodios}
        onOpenChange={onOpenChangeVerEpisodios}
        podcast_reference={podcast}
        refresh_function={fetch_function}
      />
      <DeletarPodcastModal
        podcast_id={podcast._id}
        refresh_function={fetch_function}
        onOpenChange={onOpenChangeDelete}
        isOpen={isOpenDelete}
      />
    </>
  );
};

export default PodcastStudioCard;
