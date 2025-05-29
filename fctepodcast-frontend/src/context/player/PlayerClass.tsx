// PlayerClass.ts (ajuste necessário na classe Player)
import type { EpisodioType } from "../../utils/types/EpisodioType";

export class Player {
  private playlist: EpisodioType[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private audioRef: React.RefObject<HTMLAudioElement> | null = null;
  private onTrackChange?: (audioPath: string) => void;

  setAudioElement(ref: React.RefObject<HTMLAudioElement>) {
    this.audioRef = ref;
  }

  setOnTrackChangeCallback(callback: (audioPath: string) => void) {
    this.onTrackChange = callback;
  }

  setPlaylist(playlist: EpisodioType[], startIndex: number = 0) {
    this.playlist = playlist;
    this.currentIndex = startIndex;
    this.playCurrent();
    console.log("Playlist set with", playlist.length, "episodes.");
  }

  private playCurrent() {
    const currentAudio = this.playlist[this.currentIndex]?.audio_path || "";
    if (this.onTrackChange) {
      this.onTrackChange(currentAudio);
    }
    this.play();
  }

  play() {
    this.isPlaying = true;
    this.audioRef?.current?.play().catch((e) => {
      console.warn("Autoplay bloqueado:", e);
    });
  }

  pause() {
    this.isPlaying = false;
    this.audioRef?.current?.pause();
  }

  next() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.playCurrent();
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playCurrent();
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTrackData(): EpisodioType | null {
    return this.playlist[this.currentIndex] || null;
  }
}
