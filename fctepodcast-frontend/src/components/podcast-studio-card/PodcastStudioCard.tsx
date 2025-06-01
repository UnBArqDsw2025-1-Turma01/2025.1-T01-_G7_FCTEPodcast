import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  useDisclosure,
} from "@heroui/react";
import no_image from "../../assets/no_image_base/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.jpg";
import type { PodcastType } from "../../utils/types/PodcastType";
import { motion } from "framer-motion";
import { IoMdAdd } from "react-icons/io";
import { MdAudiotrack } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { BASE_API_URL } from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import CriarEpisodioModal from "../modals/episodio/CriarEpisodioModal";
import VerEpisodiosModal from "../modals/episodio/VerEpisodiosModal";

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
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Image
              src={imageBlobUrl || no_image}
              alt={`Capa do podcast ${podcast.titulo}`} // Descrição acessível para leitores de tela
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
          title={podcast.descricao} // Tooltip com descrição completa para ajudar na acessibilidade
        >
          {podcast.descricao}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
          aria-label="Tags do podcast" // Label para leitores de tela explicando o conteúdo das tags
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
              {/* 
                Botão para abrir o menu dropdown
                aria-haspopup e aria-expanded informam aos leitores de tela que o botão controla um menu e se ele está aberto
              */}
              <Button aria-haspopup="menu" aria-expanded={isOpen}>
                Ver opções
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {/* 
                DropdownItem já é acessível e clicável
                Usar onClick diretamente no DropdownItem evita problema de colocar button dentro de button
              */}
              <DropdownItem key={"adicionar"} onClick={onOpen} startContent={<IoMdAdd />}>
                Adicionar Episódio
              </DropdownItem>

              <DropdownItem
                key={"ver"}
                onClick={onOpenVerEpisodios}
                startContent={<MdAudiotrack />}
              >
                Ver Episódios
              </DropdownItem>

              <DropdownItem
                key={"editar"}
                startContent={<FaPencil />}
              >
                Editar Podcast
              </DropdownItem>

              <DropdownItem
                key={"excluir"}
                color="danger"
                className="text-danger"
                startContent={<FaTrash />}
              >
                Excluir Podcast
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </motion.div>
      </motion.div>

      {/* Modais para adicionar e ver episódios */}
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
      />
    </>
  );
};

export default PodcastStudioCard;
