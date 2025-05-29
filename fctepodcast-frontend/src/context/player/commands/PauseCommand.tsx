import type { Player } from "../PlayerClass";

export class PauseCommand {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  execute(): void {
    this.player.pause();
  }
}
