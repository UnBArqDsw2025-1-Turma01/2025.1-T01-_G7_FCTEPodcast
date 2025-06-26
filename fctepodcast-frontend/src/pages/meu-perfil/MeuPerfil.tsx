import { Avatar, Image } from "@heroui/react";
import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import no_photo from "../../assets/no_image_base/icon-7797704_640.png";
import no_cover from "../../assets/no_image_base/Gemini_Generated_Image_obzlrgobzlrgobzl.png";

const MeuPerfil = () => {
  const { user } = useAuth();

  const image_url =
    user?.profile_picture === "" ? no_photo : user?.profile_picture;

  const cover_url = user?.cover_picture === "" ? no_cover : user?.cover_picture;

  return (
    <div className="h-screen">
      <div
        className="h-64 bg-cover bg-center "
        style={{
          backgroundImage: `url(${cover_url})`,
        }}
      >
        <Image className="rounded-full h-36" src={image_url} />
      </div>
    </div>
  );
};

export default MeuPerfil;
