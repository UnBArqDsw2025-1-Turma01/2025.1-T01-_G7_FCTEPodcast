// import { BiSolidSpeaker } from "react-icons/bi";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaVolumeLow } from "react-icons/fa6";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
// import { LuListMusic } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "../../context/player/PlayerContext";
import { PlayCommand } from "../../context/player/commands/PlayerCommands";
import { PauseCommand } from "../../context/player/commands/PauseCommand";
import { NextCommand } from "../../context/player/commands/NextCommand";
import { PreviousCommand } from "../../context/player/commands/PreviousCommand";
import { Slider } from "@heroui/react";

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
  } = usePlayer();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  console.log("Dados do episódio:", episode_data?.titulo);

  const handleSliderChange = (value: number | number[]) => {
    if (typeof value === "number") {
      seek(value);
    }
  };

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

  console.log(isPlaying);
  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full h-24 bg-primary-100 text-white flex items-center justify-between px-6 z-50"
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
        <div className="w-14 h-14 bg-neutral-700 rounded-md" />
        <div className="text-sm">
          <p className="font-semibold">
            {episode_data?.titulo || "Nenhum Episódio Selecionado"}
          </p>
          <p className="text-xs text-gray-400"></p>
          <p className="text-xs text-gray-400">Assunto</p>
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
          <Slider
            className="cursor-pointer"
            defaultValue={[0]}
            value={[currentTime]}
            minValue={0}
            maxValue={duration}
            step={0.1}
            onChange={(value: number | number[]) =>
              Array.isArray(value)
                ? handleSliderChange(value[0])
                : handleSliderChange(value)
            }
            size="sm"
          />
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
        {/* <LuListMusic
          size={18}
          className="text-gray-400 hover:text-white cursor-pointer"
        />
        <BiSolidSpeaker
          size={18}
          className="text-gray-400 hover:text-white cursor-pointer"
        /> */}
        <div className="flex items-center space-x-2">
          <FaVolumeLow
            size={18}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
          {/* <div className="w-20 h-1 bg-gray-600 rounded-full relative">
            <div className="absolute h-1 bg-white rounded-full w-1/2" />
          </div> */}
          <Slider
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
