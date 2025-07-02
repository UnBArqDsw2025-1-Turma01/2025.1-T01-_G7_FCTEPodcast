// import { BiSolidSpeaker } from "react-icons/bi";
import {
  FaComments,
  FaHeart,
  FaPause,
  FaPlay,
  FaRegHeart,
} from "react-icons/fa";
import { FaVolumeLow } from "react-icons/fa6";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
// import { LuListMusic } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "../../context/player/PlayerContext";
import { PlayCommand } from "../../context/player/commands/PlayerCommands";
import { PauseCommand } from "../../context/player/commands/PauseCommand";
import { NextCommand } from "../../context/player/commands/NextCommand";
import { PreviousCommand } from "../../context/player/commands/PreviousCommand";
import { addToast, Button, Image, Slider, Tooltip } from "@heroui/react";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { ReferenceDataType } from "../../utils/types/ReferenceDataType";
import { useEffect, useState } from "react";
import { BASE_API_URL, NO_IMAGE } from "../../utils/constants";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router";

const PlayBar = () => {
  const {
    dispatchCommand,
    isPlaying,
    player,
    currentTime,
    duration,
    seek,
    episode_data,
    volume,
    changeVolume,
    loading_audio,
  } = usePlayer();
  const { user } = useAuth();
  const [referenceData, setReferenceData] = useState<ReferenceDataType | null>(
    null
  );
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
  };
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);

  useEffect(() => {
    if (!isSeeking) {
      setSliderValue(currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, duration]);

  const handleSliderChange = (value: number | number[]) => {
    const numericValue = Array.isArray(value) ? value[0] : value;

    // 1. Avisa que estamos no modo de arrastar (para pausar a atualização automática)
    if (!isSeeking) {
      setIsSeeking(true);
    }
    // 2. Apenas atualiza o valor visual da bolinha do slider
    setSliderValue(numericValue);
  };

  const handleSliderChangeEnd = (value: number | number[]) => {
    const numericValue = Array.isArray(value) ? value[0] : value;

    // 1. Envia o comando de seek UMA VEZ com o valor final
    seek(numericValue);

    // 2. Avisa que terminamos o arraste
    setIsSeeking(false);
  };

  const checkLiked = async () => {
    if (!episode_data?._id || !user?.id) return;

    if (loadingLike) return; // Evita múltiplos cliques enquanto a requisição está em andamento

    setLoadingLike(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.get(
        `/usuario/episodio/${episode_data._id}/${user.id}/check/liked`
      );
      setLiked(response.data.setLiked);
    } catch {
      addToast({
        title: "Erro ao verificar curtida",
        description: "Não foi possível verificar se o episódio foi curtido.",
        color: "danger",
      });
    } finally {
      setLoadingLike(false);
    }
  };

  const handleLike = async () => {
    if (!episode_data?._id) return;

    if (loadingLike) return; // Evita múltiplos cliques enquanto a requisição está em andamento
    setLoadingLike(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await AxiosInstace.post(
        `/usuario/episodio/${episode_data._id}/like`,
        {
          usuario_id: user?.id,
        }
      );
      setLiked(res.data.setLike);
    } catch (error) {
      console.error("Erro ao curtir episódio:", error);
      addToast({
        title: "Erro ao curtir episódio",
        description: "Não foi possível curtir o episódio.",
        color: "danger",
      });
    } finally {
      setLoadingLike(false);
    }
  };

  const get_reference_data = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await AxiosInstace.get(
        `/usuario/episodios/${episode_data?._id}/reference`
      );

      setReferenceData(response.data);
    } catch (error) {
      console.error("Erro ao obter dados de referência:", error);
      addToast({
        title: "Erro ao obter dados de referência",
        description:
          "Não foi possível carregar os dados de referência do episódio.",
        color: "danger",
      });
    }
  };

  const image_request_url = `${BASE_API_URL}/usuario/episodio/${episode_data?._id}/image`;

  useEffect(() => {
    if (!episode_data?._id) return;

    const fetchImage = async () => {
      try {
        const response = await AxiosInstace.get(image_request_url, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(response.data);
        setImageBlobUrl(url);
      } catch (error) {
        console.error("Erro ao buscar imagem:", error);
        addToast({
          title: "Erro ao carregar imagem",
          description: "Não foi possível carregar a imagem do episódio.",
          color: "danger",
        });
      }
    };

    fetchImage();

    // Cleanup ao desmontar o componente
    return () => {
      if (image_request_url) URL.revokeObjectURL(image_request_url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image_request_url]);

  useEffect(() => {
    if (episode_data?._id) {
      get_reference_data();
      checkLiked();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode_data]);

  const handlePlay = () => {
    dispatchCommand(new PlayCommand(player));
  };

  const handlePause = () => {
    dispatchCommand(new PauseCommand(player));
  };

  const handleNext = () => {
    dispatchCommand(new NextCommand(player));
  };

  const handlePrevious = () => {
    dispatchCommand(new PreviousCommand(player));
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full h-24 bg-primary-200/60 backdrop-blur-md text-white flex items-center justify-between px-6 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Música atual */}
      <motion.div
        className="flex items-center space-x-4 w-1/3"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* <div className="w-14 h-14 bg-neutral-700 rounded-md" /> */}
        {!episode_data ? (
          <div className="w-14 h-14 bg-neutral-700 rounded-md" />
        ) : (
          <Image
            className="w-14 h-14 rounded-md object-cover"
            src={imageBlobUrl || NO_IMAGE}
            loading="lazy"
            isLoading={!imageBlobUrl}
            alt={episode_data?.titulo || "Imagem do episódio"}
          />
        )}
        <div className="text-sm">
          <p className="font-semibold">
            {episode_data?.titulo || "Nenhum Episódio Selecionado"}
          </p>
          {referenceData?.reference_data.autor ? (
            <p
              onClick={() =>
                navigate(`/perfil/${referenceData.reference_data.autor._id}`)
              }
              className="text-xs text-gray-400 cursor-pointer hover:underline"
            >
              {referenceData?.reference_data.autor.nome}
            </p>
          ) : (
            <p className="text-xs text-gray-400">Autor Desconhecido</p>
          )}

          <p className="text-xs text-gray-400 italic">
            {referenceData?.reference_data.tags.join(", ")}
          </p>
        </div>
      </motion.div>

      {/* Controles de reprodução */}
      <motion.div
        className="flex flex-col items-center w-1/3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center space-x-4 mb-1">
          <motion.button
            onClick={handlePrevious}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoMdSkipBackward
              size={20}
              className="hover:text-white cursor-pointer"
            />
          </motion.button>

          <motion.button
            onClick={isPlaying ? handlePause : handlePlay}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15 }}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transition"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isPlaying ? "pause" : "play"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoMdSkipForward
              size={20}
              className="hover:text-white cursor-pointer"
            />
          </motion.button>
        </div>
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>
          {loading_audio && (
            <div className="flex items-center space-x-2 w-full justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
          )}
          {!loading_audio && (
            <Slider
              aria-label="Tempo de reprodução"
              className="cursor-pointer"
              minValue={0}
              maxValue={duration}
              step={0.1}
              value={sliderValue}
              // MUDANÇA: onChange é para a atualização VISUAL durante o arraste
              onChange={handleSliderChange}
              // MUDANÇA: onChangeEnd é para a AÇÃO FINAL após soltar
              onChangeEnd={handleSliderChangeEnd}
              size="sm"
            />
          )}
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </motion.div>

      {/* Controles laterais */}

      <motion.div
        className="flex items-center justify-end space-x-4 w-1/3"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {episode_data ? (
          <>
            <Tooltip content="Ver comentários" placement="top">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Button
                  isIconOnly
                  aria-label="Ver comentários"
                  onPress={() => navigate(`/${episode_data?._id}/comentarios`)}
                  color="primary"
                  className="flex items-center justify-center"
                >
                  <FaComments />
                </Button>
              </motion.div>
            </Tooltip>

            <Tooltip
              content={liked ? "Remover Curtida" : "Curtir"}
              placement="top"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              >
                <Button
                  isIconOnly
                  aria-label="Curtir episódio"
                  color="primary"
                  className="flex items-center justify-center"
                  onPress={handleLike}
                  isLoading={loadingLike}
                >
                  {!liked ? <FaRegHeart size={16} /> : <FaHeart size={16} />}
                </Button>
              </motion.div>
            </Tooltip>
          </>
        ) : (
          <></>
        )}

        <div className="flex items-center space-x-2">
          <FaVolumeLow
            size={18}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
          {/* <div className="w-20 h-1 bg-gray-600 rounded-full relative">
            <div className="absolute h-1 bg-white rounded-full w-1/2" />
          </div> */}
          <Slider
            aria-label="Volume"
            minValue={0}
            maxValue={1}
            step={0.01}
            value={volume}
            onChange={(value) => {
              if (typeof value === "number") {
                changeVolume(value);
              }
            }}
            className="w-24 cursor-pointer"
            size="sm"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlayBar;
