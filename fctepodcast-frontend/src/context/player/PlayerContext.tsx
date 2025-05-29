import { createContext, useContext, useRef, useState } from "react";
import type { Command } from "./Command";
import { Player } from "./PlayerClass";

interface PlayerContextProps {
  dispatchCommand: (command: Command) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPlaylist: (episodes: any[]) => void;
  isPlaying?: boolean;
  player: Player;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

// TODO: CONSERTAR OS TYPES
export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const playerRef = useRef(new Player());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const dispatchCommand = (command: Command) => {
    command.execute();
    setIsPlaying(playerRef.current.getIsPlaying());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPlaylist = (episodes: any[], startIndex = 0) => {
    playerRef.current.setPlaylist(episodes, startIndex);
  };

  return (
    <PlayerContext.Provider
      value={{
        dispatchCommand,
        setPlaylist,
        isPlaying,
        player: playerRef.current,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
