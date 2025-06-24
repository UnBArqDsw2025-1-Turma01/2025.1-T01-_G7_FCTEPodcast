// PlayerProvider.tsx (VERSÃO REVISADA E CENTRALIZADA)
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Command } from "./Command"; // Supondo que você ainda use Command
import { Player } from "./PlayerClass";
import type { EpisodioType } from "../../utils/types/EpisodioType";
import { BASE_API_URL } from "../../utils/constants";

interface PlayerContextProps {
  dispatchCommand: (command: Command) => void;
  setPlaylist: (episodes: EpisodioType[], startIndex?: number) => void;
  isPlaying: boolean;
  player: Player;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  episode_data: EpisodioType | null;
  changeVolume: (value: number) => void;
  volume: number;
  loading_audio: boolean;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  // MUDANÇA: Player agora é apenas uma referência, sem estado próprio de UI
  const playerRef = useRef(new Player());

  // MUDANÇA: O estado do React é a ÚNICA fonte da verdade agora
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<EpisodioType | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // MUDANÇA: Efeito para registrar os callbacks na classe Player
  useEffect(() => {
    const player = playerRef.current;

    player.setOnTrackChange((track) => {
      setCurrentTrack(track);
    });
    player.setOnPlayRequest(() => {
      setIsPlaying(true);
    });
    player.setOnPauseRequest(() => {
      setIsPlaying(false);
    });
  }, []); // Roda apenas uma vez

  // MUDANÇA: Efeito para preparar a URL do áudio quando a faixa mudar
  useEffect(() => {
    if (currentTrack?.audio_path) {
      const url = `${BASE_API_URL}/file/audio/${encodeURIComponent(
        currentTrack.audio_path
      )}`;
      setAudioSrc(url);
      setIsLoading(true); // Começa a carregar
    } else {
      setAudioSrc(""); // Limpa a URL se não houver faixa
    }
  }, [currentTrack]);

  // MUDANÇA: Efeito ÚNICO para controlar play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audio.src) {
      // Se a fonte mudou, o play só vai funcionar depois que carregar
      // O evento onCanPlay já cuidará disso. Se não mudou, toca direto.
      if (!audio.paused) return; // Se já estiver tocando, não faz nada
      audio.play().catch((e) => {
        console.warn("Autoplay bloqueado pelo navegador:", e);
        setIsPlaying(false); // Sincroniza o estado de volta
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]); // Depende do estado isPlaying e da fonte

  // MUDANÇA: Funções de controle agora são mais simples
  const setPlaylist = (episodes: EpisodioType[], startIndex: number = 0) => {
    playerRef.current.setPlaylist(episodes, startIndex);
  };

  const dispatchCommand = (command: Command) => {
    command.execute();
    // Não precisa mais sincronizar estado aqui, os callbacks já fazem isso
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const changeVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    setVolume(value);
  };

  const resetPlayer = () => {
    playerRef.current.reset(); // A classe notifica o React para limpar a faixa
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
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
        episode_data: currentTrack,
        changeVolume,
        volume,
        loading_audio: isLoading,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={audioSrc} // MUDANÇA: A fonte é definida diretamente aqui
        onLoadedData={() => {
          // Quando os dados são carregados, podemos definir a duração e tentar tocar
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            if (isPlaying) {
              audioRef.current
                .play()
                .catch((e) => console.warn("Erro ao tocar após carregar", e));
            }
          }
        }}
        onCanPlay={() => setIsLoading(false)} // Esconde o loading quando PODE tocar
        onPlaying={() => setIsLoading(false)} // Esconde o loading quando ESTÁ tocando
        onWaiting={() => setIsLoading(true)} // Mostra o loading se a conexão ficar lenta
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={() => playerRef.current.next()}
        onError={() => {
          setIsLoading(false);
          console.error("Erro no elemento <audio>");
        }}
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
    </PlayerContext.Provider>
  );
};

// O hook usePlayer continua igual
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
