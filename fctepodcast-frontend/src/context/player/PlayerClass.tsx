// PlayerClass.ts (VERSÃO REVISADA E SIMPLIFICADA)
import type { EpisodioType } from "../../utils/types/EpisodioType";
import { addToast } from "@heroui/react";

export class Player {
  private playlist: EpisodioType[] = [];
  private currentIndex: number = 0;

  // Callbacks para notificar o componente React
  private onTrackChangeCallback?: (track: EpisodioType | null) => void;
  private onPlayRequestCallback?: () => void;
  private onPauseRequestCallback?: () => void;

  // Métodos para o React se registrar
  public setOnTrackChange(callback: (track: EpisodioType | null) => void) {
    this.onTrackChangeCallback = callback;
  }
  public setOnPlayRequest(callback: () => void) {
    this.onPlayRequestCallback = callback;
  }
  public setOnPauseRequest(callback: () => void) {
    this.onPauseRequestCallback = callback;
  }

  public setPlaylist(playlist: EpisodioType[], startIndex: number = 0) {
    if (!Array.isArray(playlist) || playlist.length === 0) {
      addToast({
        title: "Atenção!",
        description: "Não há episódios disponíveis para reprodução.",
        color: "warning",
      });
      return;
    }

    this.playlist = playlist;
    this.currentIndex = startIndex;

    // Notifica o React que a faixa mudou e que ele deve começar a tocar
    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(this.getCurrentTrackData());
    }
    this.play(); // Solicita o play da nova faixa
  }

  // Agora, os métodos de controle APENAS disparam os callbacks.
  // Eles não controlam mais o estado de isPlaying ou o audioRef.
  public play() {
    if (this.onPlayRequestCallback) {
      this.onPlayRequestCallback();
    }
  }

  public pause() {
    if (this.onPauseRequestCallback) {
      this.onPauseRequestCallback();
    }
  }

  public next() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      if (this.onTrackChangeCallback) {
        this.onTrackChangeCallback(this.getCurrentTrackData());
      }
      this.play(); // Solicita o play da nova faixa
    }
  }

  public previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.onTrackChangeCallback) {
        this.onTrackChangeCallback(this.getCurrentTrackData());
      }
      this.play(); // Solicita o play da nova faixa
    }
  }

  public getCurrentTrackData(): EpisodioType | null {
    return this.playlist[this.currentIndex] || null;
  }

  public reset() {
    this.playlist = [];
    this.currentIndex = 0;
    if (this.onTrackChangeCallback) {
      // Notifica o React para limpar a faixa atual
      this.onTrackChangeCallback(null);
    }
  }
}
