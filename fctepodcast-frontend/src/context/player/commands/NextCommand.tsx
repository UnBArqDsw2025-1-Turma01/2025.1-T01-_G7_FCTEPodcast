import type { Player } from "../PlayerClass";

export class NextCommand {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  execute(): void {
    this.player.next();
  }
}
