import { Button, Image } from "@heroui/react";
import no_image from "../../assets/no_image_base/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.jpg";

const PodcastStudioCard = () => {
  return (
    <div className="bg-primary-50 p-4 rounded-xl flex items-center justify-between">
      <div className="flex gap-4">
        <Image src={no_image} className="w-16" />
        <div>
          <p className="font-bold">Nome do Podcast</p>
          <p className="">Autores</p>
        </div>
      </div>

      <div>
        <p className="text-gray-500 mt-2">
          Descrição do podcast. Aqui você pode adicionar uma breve descrição do
          conteúdo, temas abordados e outros detalhes relevantes.
        </p>
      </div>

      <div>
        <Button>Adicionar Episódio</Button>
      </div>
    </div>
  );
};

export default PodcastStudioCard;
