import type { Command } from "../Command";
import type { Player } from "../PlayerClass";

export class PlayCommand implements Command {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  execute(): void {
    this.player.play();
  }
}
