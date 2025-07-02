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
  const playerRef = useRef(new Player());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<EpisodioType | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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
  }, []);

  useEffect(() => {
    if (!currentTrack?.audio_path) {
      setAudioSrc("");
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }

    const url = `${BASE_API_URL}/file/audio/${encodeURIComponent(
      currentTrack.audio_path
    )}`;
    setAudioSrc(url);
    setIsLoading(true);
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audio.src) {
      if (!audio.paused) return;
      audio.play().catch((e) => {
        console.warn("Autoplay bloqueado pelo navegador:", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]);

  const setPlaylist = (episodes: EpisodioType[], startIndex: number = 0) => {
    playerRef.current.setPlaylist(episodes, startIndex);
  };

  const dispatchCommand = (command: Command) => {
    command.execute();
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
    playerRef.current.reset();
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
        src={audioSrc}
        onLoadedData={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            if (isPlaying) {
              audioRef.current
                .play()
                .catch((e) => console.warn("Erro ao tocar após carregar", e));
            }
          }
        }}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
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
// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
