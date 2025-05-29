import type { EpisodioType } from "../../utils/types/EpisodioType";
import { Image } from "@heroui/react";

const EpisodioStudioCard = ({
  episodio,
  image_blob_url,
}: {
  episodio: EpisodioType;
  image_blob_url: string | null;
}) => {
  return (
    <div className="bg-primary-50 p-2 rounded-xl h-24">
      <div className="flex gap-4">
        <Image
          src={image_blob_url || "no_image"}
          className="w-20 h-20 rounded-lg object-cover"
          alt={episodio.titulo}
        />

        <div className="w-52">
          <h3 className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {episodio.titulo}
          </h3>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {episodio.descricao}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">
              {episodio.curtidas_count} curtidas
            </p>
            <p className="text-sm text-gray-500">
              {episodio.comentarios_count} comentários
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodioStudioCard;
