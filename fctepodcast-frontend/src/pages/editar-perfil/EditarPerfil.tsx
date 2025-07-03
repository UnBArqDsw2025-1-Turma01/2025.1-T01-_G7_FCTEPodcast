import { Button, Image, Input } from "@heroui/react";
import { useAuth } from "../../context/auth/AuthContext";
import no_photo from "../../assets/no_image_base/icon-7797704_640.png";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";

const EditarPerfil = () => {
  const { user, updateProfilePicture } = useAuth();
  const [novaFoto, setNovaFoto] = useState<File | null>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNovaFoto(file);
    }
  };

  const getImage = async () => {
    console.log(user);
    if (user?.profile_picture) {
      const responseImage = await AxiosInstace(
        `/files/images/${user.profile_picture}`,
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
  };

  useEffect(() => {
    getImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl); // Libera a URL do blob quando o componente é desmontado
      }
      if (novaFoto) {
        URL.revokeObjectURL(URL.createObjectURL(novaFoto)); // Libera a URL do blob da nova foto
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeProfilePic = async () => {
    if (!novaFoto) {
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", novaFoto);
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.post(
        `/usuario/perfil/${user?.id}/alterar/foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (user) {
        updateProfilePicture(response.data.usuarioAtualizado.profile_picture);
      }

      setNovaFoto(null);
      getImage(); // Atualiza a imagem após a mudança
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 gap-8">
      <motion.h2
        className="font-bold text-3xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Editar Perfil
      </motion.h2>

      <motion.div
        className=" flex flex-col md:flex-row justify-between items-center gap-8 p-6 rounded-xl shadow-lg bg-content1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        layout
      >
        {/* Foto de Perfil */}
        <motion.div
          className="flex flex-col gap-4 items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold">Foto de Perfil</h3>
          <Image
            className="w-40 h-40 rounded-full object-cover shadow-md"
            src={
              novaFoto
                ? URL.createObjectURL(novaFoto)
                : imageBlobUrl || no_photo
            }
            alt="Foto de perfil"
          />
          <Input onChange={handleFileChange} type="file" />

          <AnimatePresence>
            {novaFoto && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  isLoading={loading}
                  onPress={handleChangeProfilePic}
                  color="primary"
                >
                  Atualizar Foto
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Informações do Usuário */}
      <motion.div
        className="flex flex-col items-center gap-4 w-[60%] mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold">Informações do Usuário</h3>
        <div className="flex flex-col gap-4 w-full">
          <Input disabled isReadOnly label="Nome" value={user?.nome || ""} />
          <Input disabled isReadOnly label="Email" value={user?.email || ""} />
        </div>
      </motion.div>
    </div>
  );
};

export default EditarPerfil;
