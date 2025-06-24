// PlayerClass.ts (ajuste necessário na classe Player)
import { addToast } from "@heroui/react";
import type { EpisodioType } from "../../utils/types/EpisodioType";

export class Player {
  private playlist: EpisodioType[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private audioRef: React.RefObject<HTMLAudioElement | null> | null = null;
  private onTrackChange?: (audioPath: string) => void;

  setAudioElement(ref: React.RefObject<HTMLAudioElement | null>) {
    this.audioRef = ref;
  }

  setOnTrackChangeCallback(callback: (audioPath: string) => void) {
    this.onTrackChange = callback;
  }

  setPlaylist(playlist: EpisodioType[], startIndex: number = 0) {
    if (!Array.isArray(playlist) || playlist.length === 0) {
      addToast({
        title: "Atenção!",
        description: "Não há episódios disponíveis para reprodução.",
        color: "warning",
      });
      return;
    }

    // Verifica se a playlist e o índice são iguais aos atuais
    const isSamePlaylist =
      this.playlist.length === playlist.length &&
      this.playlist.every((ep, i) => ep._id === playlist[i]._id) &&
      this.currentIndex === startIndex;

    if (isSamePlaylist) {
      console.log("Playlist já está configurada e na mesma posição.");
      // Se for a mesma playlist e mesma posição, só garante que está tocando
      if (!this.isPlaying) {
        console.log("Reiniciando a reprodução da playlist.");
        this.play();
      }
      return; // não reinicia a playlist nem troca o áudio
    }

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
    console.log("Chamando play(). audioRef:", this.audioRef?.current);
    this.isPlaying = true;
    this.audioRef?.current
      ?.play()
      .then(() => {
        console.log("Reprodução iniciada com sucesso");
        this.isPlaying = true;
      })
      .catch((e) => {
        console.warn("Falha ao tentar reproduzir:", e);
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

  reset() {
    this.pause();
    this.playlist = [];
    this.currentIndex = 0;
    if (this.audioRef?.current) {
      this.audioRef.current.src = "";
      this.audioRef.current.load();
    }
  }
}
