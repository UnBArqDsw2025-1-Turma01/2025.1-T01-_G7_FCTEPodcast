import type { EpisodioType } from "../../utils/types/EpisodioType";

export class Player {
  private playlist: EpisodioType[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;

  setPlaylist(playlist: EpisodioType[], startIndex: number = 0) {
    this.playlist = playlist;
    this.currentIndex = startIndex;
    this.play();
  }

  play() {
    console.log("Playing episode:");
    this.isPlaying = true;
  }

  pause() {
    console.log("Playback paused.");
    this.isPlaying = false;
    // Here you would add the logic to pause the playback
  }

  next() {
    console.log("Playing next episode:");
  }

  previous() {
    console.log("Playing previous episode:");
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
