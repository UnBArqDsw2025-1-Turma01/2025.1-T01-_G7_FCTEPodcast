import { FaComments, FaTrash } from "react-icons/fa";
import type { EpisodioType } from "../../utils/types/EpisodioType";
import { Button, Image, useDisclosure } from "@heroui/react";
import { useNavigate } from "react-router";
import DeletarEpisodioModal from "../modals/episodio/DeletarEpisodioModal";

const EpisodioStudioCard = ({
  episodio,
  image_blob_url,
  refresh_function,
}: {
  episodio: EpisodioType;
  image_blob_url: string | null;
  refresh_function: () => void;
}) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="bg-primary-50 p-2 rounded-xl h-24">
      <div className="flex gap-4">
        <Image
          src={image_blob_url || "no_image"}
          className="w-20 h-20 rounded-lg object-cover"
          alt={episodio.titulo}
        />

        <div className="w-52 flex flex-col justify-between">
          <h3 className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {episodio.titulo}
          </h3>
          <p className="overflow-hidden break-words">{episodio.descricao}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">
              {episodio.curtidas_count} curtidas
            </p>
            <p className="text-sm text-gray-500">
              {episodio.comentarios_count} comentários
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            onPress={() => navigate(`/${episodio?._id}/comentarios`)}
            isIconOnly
            color="primary"
          >
            <FaComments />
          </Button>

          <Button
            onPress={onOpen}
            isIconOnly
            color="danger"
            className="text-white"
          >
            <FaTrash />
          </Button>
        </div>
      </div>

      <DeletarEpisodioModal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        episodio={episodio}
        refresh_function={refresh_function}
      />
    </div>
  );
};

export default EpisodioStudioCard;
