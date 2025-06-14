import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Command } from "./Command";
import { Player } from "./PlayerClass";
import { AxiosInstace } from "../../utils/axios/AxiosInstance";
import type { EpisodioType } from "../../utils/types/EpisodioType";

interface PlayerContextProps {
  dispatchCommand: (command: Command) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPlaylist: (episodes: any[]) => void;
  isPlaying?: boolean;
  player: Player;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  episode_data: EpisodioType | null;
  changeVolume: (value: number) => void;
  volume: number;
  loading_audio?: boolean;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

// O Gof Command é um padrão de design que encapsula uma solicitação como um objeto,
// permitindo que você parametrize clientes com filas, solicitações e operações que podem ser executadas ou desfeitas.
// Ele permite que você desacople o remetente de uma solicitação do receptor da solicitação,
// Portanto, o remetente não precisa saber nada sobre o receptor,
// e o receptor não precisa saber nada sobre o remetente.
// O PlayerContext é um contexto React que fornece funcionalidades de controle de reprodução de áudio,
// como play, pause, next, previous, e manipulação de playlist.
// Ele encapsula a lógica de reprodução de áudio, permitindo que os componentes filhos acessem e controlem o estado do player.
export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const playerRef = useRef(new Player());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [volume, setVolume] = useState<number>(1);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    playerRef.current.setOnTrackChangeCallback((newAudioPath) => {
      setAudioPath(newAudioPath);
      setCanPlay(false);
      setIsPlaying(true);
    });
  }, []);

  useEffect(() => {
    if (!audioPath) return;

    const fetchAudio = async () => {
      setLoadingAudio(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await AxiosInstace.get(
          `/usuario/image?path=${encodeURIComponent(audioPath)}`,
          { responseType: "blob" }
        );
        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "audio/mpeg",
        });
        const url = URL.createObjectURL(blob);
        setAudioBlobUrl(url);
        setCanPlay(false);
      } catch (err) {
        console.error("Erro ao buscar áudio:", err);
      } finally {
        setLoadingAudio(false);
      }
    };
    fetchAudio();

    return () => {
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
        setAudioBlobUrl(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioPath]);

  useEffect(() => {
    if (audioRef.current && audioBlobUrl) {
      audioRef.current.src = audioBlobUrl;
      audioRef.current.load();
      setCanPlay(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [audioBlobUrl]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && canPlay) {
      audioRef.current.play().catch((e) => {
        console.warn("Autoplay bloqueado:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, canPlay]);

  const changeVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    setVolume(value);
  };

  const handleCanPlay = () => {
    setCanPlay(true);
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.warn("Erro ao tocar:", e);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    playerRef.current.next();
  };

  const dispatchCommand = (command: Command) => {
    command.execute();
    setIsPlaying(playerRef.current.getIsPlaying());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPlaylist = (episodes: any[], startIndex = 0) => {
    playerRef.current.setPlaylist(episodes, startIndex);
  };

  // Função para avançar/retroceder o áudio ao clicar na barra
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
    }
    setAudioBlobUrl(null);
    setAudioPath(""); // limpar também o caminho do áudio para forçar recarregamento
    setCanPlay(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    playerRef.current.reset();
  };

  return (
    <PlayerContext.Provider
      value={{
        resetPlayer,
        dispatchCommand,
        setPlaylist,
        isPlaying,
        player: playerRef.current,
        currentTime,
        duration,
        seek,
        episode_data: playerRef.current.getCurrentTrackData(),
        changeVolume,
        volume,
        loading_audio: loadingAudio,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{ display: "none" }}
      />
    </PlayerContext.Provider>
  );
};

// O hook usePlayer é um hook personalizado que permite acessar o contexto do PlayerContext.
// Ele verifica se o contexto está definido e, se não estiver, lança um erro informando que o hook deve ser usado dentro de um PlayerProvider.
// Isso garante que o hook só seja usado em componentes que estão dentro do PlayerProvider, evitando erros de contexto não definido.
// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};

// Adaptações
// Como o React é baseado em funções, hooks e estado imutável, algumas adaptações são necessárias
// * Command como Função com Estado Capturado (Closure)
// Em vez de guardar um "receiver" (objeto) como atributo, você injeta funções (callbacks) como dependência no construtor.
// Isso usa o conceito de closure do JavaScript: funções capturam o escopo onde foram criadas.
// * Invoker como uma função dentro do Contexto
// O invocador não é mais um objeto com estado, é apenas uma função (executeCommand) fornecida pelo Context.
// Isso mantém o acoplamento fraco: qualquer componente pode disparar comandos sem conhecer a lógica.
// * Receiver vira uma função vinda do Context Original (OO):
// O "receiver" que realmente realiza a ação (como tocar o episódio ou atualizar a fila) é representado por funções como playEpisode, addToQueue, setQueue, passadas como dependências nos comandos.
// * Uso do React Context como meio de Inversão de Controle
// No padrão GoF, comandos podem ser injetados em tempo de execução. Em React, você faz isso usando o Context API, que fornece as funções (os "receivers") e o invocador (executeCommand) aos componentes filhos.
// * Componentes se tornam "Clientes" desacoplados
// Os componentes React agora agem como o cliente do padrão Command, sem precisar conhecer a lógica interna da ação:
