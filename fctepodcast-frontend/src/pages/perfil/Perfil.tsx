import { addToast, Button, Image } from "@heroui/react";
import no_photo from "../../assets/no_image_base/icon-7797704_640.png";
import no_cover from "../../assets/no_image_base/Gemini_Generated_Image_obzlrgobzlrgobzl.png";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import { useAuth } from "../../context/auth/AuthContext";
import PerfilProfessor from "./professor/PerfilProfessor";
import { motion } from "framer-motion";

interface Usuario {
  nome: string;
  email: string;
  role: string;
  profile_picture: string;
  cover_picture: string;
}

const Perfil = () => {
  const { usuario_id } = useParams<{ usuario_id: string }>();
  const { user } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const isSameUser = user?.id === usuario_id;
  const navigate = useNavigate();
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");

  const getUsuario = async () => {
    if (!usuario_id) {
      addToast({
        title: "Erro",
        description: "Usuário não encontrado.",
        color: "danger",
      });
      return;
    }

    try {
      const response = await AxiosInstace.get(`/usuario/perfil/${usuario_id}`);

      setUsuario(response.data.usuario);

      if (response.data.usuario?.profile_picture) {
        const responseImage = await AxiosInstace(
          `/files/images/${response.data.usuario?.profile_picture}`,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([responseImage.data], {
          type: responseImage.headers["content-type"],
        });
        const url = URL.createObjectURL(blob);
        setImageBlobUrl(url);
      } else {
        setImageBlobUrl("");
      }
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

  console.log(imageBlobUrl);
  console.log(usuario);

  return (
    <div className="h-screen flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="h-64 bg-cover bg-center flex items-center gap-4 p-4 rounded-xl"
        style={{
          backgroundImage: `url(${no_cover})`,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            className="rounded-full h-36 object-cover shadow-md"
            src={imageBlobUrl || no_photo}
            width={144}
            height={144}
            alt="Foto de perfil"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-2"
        >
          <h2 className="font-bold text-2xl">{usuario?.nome}</h2>
          <p>{usuario?.email}</p>
          {isSameUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Button
                color="primary"
                onPress={() => navigate("/usuario/perfil/editar")}
              >
                Editar Perfil
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        {usuario?.role === "PROFESSOR" && usuario_id && (
          <PerfilProfessor usuario_id={usuario_id} />
        )}
      </motion.div>
    </div>
  );
};

export default Perfil;
