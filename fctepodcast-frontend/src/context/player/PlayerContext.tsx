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
  episode_data: EpisodioType | null; // Adicione o tipo correto para episode_data se necessário
  changeVolume: (value: number) => void;
  volume: number;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const playerRef = useRef(new Player());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [volume, setVolume] = useState<number>(1);

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

  return (
    <PlayerContext.Provider
      value={{
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

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
