import { useEffect, useState } from "react";
import type { UserType } from "../../../utils/types/UserType";
import { getImageUrlFromPath } from "../../../hooks/static/useImageFromPath";
import { Card, CardBody, Image } from "@heroui/react";
import { useNavigate } from "react-router";

const AuthorCard = ({ criador }: { criador: UserType }) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    async function fetchImage() {
      if (!criador.profile_picture) {
        setImageBlobUrl("");
        return;
      }

      try {
        const url = await getImageUrlFromPath(criador.profile_picture);
        if (isActive) {
          setImageBlobUrl(url);
          objectUrl = url;
        } else {
          URL.revokeObjectURL(url);
        }
      } catch {
        if (isActive) {
          setImageBlobUrl("");
        }
      }
    }

    fetchImage();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [criador.profile_picture]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <button onClick={() => navigate(`/perfil/${(criador as any)._id}`)}>
      <Card className="relative w-56 h-72 overflow-hidden cursor-pointer group transition-transform hover:scale-105 shadow-lg">
        {/* Fundo com imagem e blur */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageBlobUrl})`,
            filter: "blur(15px) brightness(0.4)",
          }}
        />

        {/* Camada escura adicional */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Conteúdo */}
        <CardBody className="relative z-10 flex flex-col items-center justify-center text-center gap-3 h-full">
          <Image
            src={imageBlobUrl || ""}
            alt={criador.nome}
            className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
          />
          <h2 className="text-lg font-bold text-white drop-shadow">
            {criador.nome}
          </h2>
        </CardBody>
      </Card>
    </button>
  );
};

export default AuthorCard;
