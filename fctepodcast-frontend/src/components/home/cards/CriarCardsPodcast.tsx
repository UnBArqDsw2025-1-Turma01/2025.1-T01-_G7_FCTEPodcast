import {
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PodcastType } from "../../../utils/types/PodcastType";
import { BASE_API_URL, NO_IMAGE } from "../../../utils/constants";
import axios from "axios";
import { BiPlayCircle } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
  }),
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
};

const PodcastCard = ({
  podcast,
  onPress,
  index,
}: {
  podcast: PodcastType;
  onPress?: () => void;
  index: number;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const navigate = useNavigate();
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
        setImageBlobUrl(null);
        setLoadingImage(false);
      });

    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcast?.imagem_path]);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
    >
      <Card
        isPressable
        shadow="sm"
        onPress={onPress}
        className="w-56 h-80 group relative flex flex-col items-center pt-4"
      >
        {/* Wrapper da imagem */}
        <div className="relative w-[200px] h-[200px]">
          <Image
            alt="cover"
            src={imageBlobUrl || NO_IMAGE}
            isLoading={loadingImage}
            width={200}
            height={200}
            className="rounded-xl object-cover w-full h-full"
          />

          {/* Ícone de play no hover */}
          <BiPlayCircle className="absolute bottom-2 right-2 text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg" />
        </div>

        {/* Conteúdo textual */}
        <CardBody className="flex flex-row gap-2 items-start justify-between text-start w-full px-4">
          <div className="flex flex-col gap-1 w-[86%] h-[100%]">
            <h2
              className="font-bold text-sm truncate w-full"
              title={podcast.titulo}
            >
              {podcast.titulo}
            </h2>
            <p className="text-sm truncate w-full" title={podcast.autor.nome}>
              {podcast.autor.nome}
            </p>
            <p className="text-xs italic break-words w-full max-h-10 overflow-hidden">
              {podcast.tags.join(", ")}
            </p>
          </div>

          <div>
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <span>
                  <BsThreeDotsVertical />
                </span>
              </DropdownTrigger>

              <DropdownMenu
                disabledKeys={["ver-podcast"]}
                itemClasses={{
                  base: [
                    "rounded-md",
                    "text-default-500",
                    "transition-opacity",
                    "data-[hover=true]:text-foreground",
                    "data-[hover=true]:bg-default-100",
                    "dark:data-[hover=true]:bg-default-50",
                    "data-[selectable=true]:focus:bg-default-50",
                    "data-[pressed=true]:opacity-70",
                    "data-[focus-visible=true]:ring-default-500",
                  ],
                }}
              >
                <DropdownSection showDivider>
                  <DropdownItem isReadOnly key={"ver-podcast"}>
                    <div className="flex items-center gap-2">
                      <Image className="h-14" src={imageBlobUrl || NO_IMAGE} />
                      <div>
                        <p className="text-xs">{podcast.titulo}</p>
                        <p className="text-xs italic">{podcast.autor.nome}</p>
                      </div>
                    </div>
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection>
                  <DropdownItem
                    key={"ver-detalhes"}
                    onPress={() => navigate(`/podcast/${podcast._id}`)}
                  >
                    <span className="flex items-center gap-2">
                      <CgDetailsMore />
                      Ver detalhes
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    key={"ver-autor"}
                    onPress={() => navigate(`/perfil/${podcast.autor._id}`)}
                  >
                    <span className="flex items-center gap-2">
                      <FaGraduationCap />
                      Ver Autor
                    </span>
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PodcastCard;
