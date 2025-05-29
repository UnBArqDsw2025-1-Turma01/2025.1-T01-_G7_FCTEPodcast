import type { Player } from "../PlayerClass";

export class PreviousCommand {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  execute(): void {
    this.player.previous();
  }
}
