import { Monocle } from "../../components/animated-emojis/AnimatedEmojis";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <p className="italic">Ops...</p>
      <Monocle />
      <p className="text-lg">
        Você não tem autorização para acessar esta página.
      </p>
      <Button
        onPress={() => {
          navigate(-1);
        }}
      >
        Voltar a página anterior
      </Button>
    </div>
  );
};

export default Unauthorized;
