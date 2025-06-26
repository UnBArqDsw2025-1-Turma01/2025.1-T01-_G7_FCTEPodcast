import { addToast, Image } from "@heroui/react";
import no_photo from "../../assets/no_image_base/icon-7797704_640.png";
import no_cover from "../../assets/no_image_base/Gemini_Generated_Image_obzlrgobzlrgobzl.png";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";

interface Usuario {
  nome: string;
  email: string;
  role: string;
  profile_picture: string;
  cover_picture: string;
}

const Perfil = () => {
  const { usuario_id } = useParams<{ usuario_id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const getUsuario = async () => {
    if (!usuario_id) {
      return;
    }

    try {
      const response = await AxiosInstace.get(`/usuario/perfil/${usuario_id}`);

      setUsuario(response.data.usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      addToast({
        title: "Erro ao buscar usuário",
        description: "Não foi possível carregar as informações do usuário.",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    getUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario_id]);

  return (
    <div className="h-screen">
      <div
        className="h-64 bg-cover bg-center flex items-center gap-4 p-4 rounded-xl"
        style={{
          backgroundImage: `url(${no_cover})`,
        }}
      >
        <Image className="rounded-full h-36" src={no_photo} />
        <div>
          <h2 className="font-bold text-2xl">{usuario?.nome}</h2>
          <p>{usuario?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
