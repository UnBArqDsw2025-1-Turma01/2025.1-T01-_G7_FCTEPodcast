import { Peeking } from "../../components/animated-emojis/AnimatedEmojis";

const LoaderMini = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Peeking />
      <p className="text-2xl font-bold mt-4">
        {" "}
        Carregando
        <span className="inline-block animate-bounce-dot [animation-delay:0ms]">
          .
        </span>
        <span className="inline-block animate-bounce-dot [animation-delay:200ms]">
          .
        </span>
        <span className="inline-block animate-bounce-dot [animation-delay:400ms]">
          .
        </span>
      </p>

      <p>Estamos resgatando os dados mais recentes para você!</p>
    </div>
  );
};

export default LoaderMini;
