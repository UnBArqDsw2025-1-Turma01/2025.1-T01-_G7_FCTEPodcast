import { useEffect, useState } from "react";
import type { PodcastType } from "../../utils/types/PodcastType";
import { Button, Image } from "@heroui/react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constants";
import { FaPlay } from "react-icons/fa";
import { usePlayer } from "../../context/player/PlayerContext";

const PodcastSmallCard = ({
  podcast,
  index,
}: {
  podcast: PodcastType;
  index: number;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | undefined>(
    undefined
  );
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const { setPlaylist } = usePlayer();

  useEffect(() => {
    if (!podcast?.imagem_path) return;
    setLoadingImage(true);
    axios
      .get(
        `${BASE_API_URL}/usuario/image?path=${encodeURIComponent(
          podcast.imagem_path
        )}`,
        { responseType: "blob" }
      )
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setImageBlobUrl(url);
        setLoadingImage(false);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        setImageBlobUrl(undefined);
        setLoadingImage(false);
      });

    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcast?.imagem_path]);

  return (
    <div className="bg-content1 p-2 rounded-2xl flex gap-4 items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{index}</span>
        <Image
          className="h-20 w-20"
          isLoading={loadingImage}
          src={imageBlobUrl}
        />
        <div>
          <h2 className="font-bold">{podcast.titulo}</h2>
          <p className="text-sm w-[35em]  truncate">{podcast.descricao}</p>
          {podcast.tags && podcast.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {podcast.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-500 text-white px-2 py-1 rounded-xl text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <span className="text-gray-500">{podcast.reproducoes} Reproduções</span>
      </div>

      <div>
        <Button
          color="primary"
          variant="solid"
          isIconOnly
          onPress={() => setPlaylist(podcast.episodios)}
        >
          <FaPlay />
        </Button>
      </div>
    </div>
  );
};

export default PodcastSmallCard;
