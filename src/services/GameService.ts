import { Pawn } from "@/models/Game";
import { IPlayer } from "@/models/Player";
import { Service } from "typedi";

@Service()
export class GameService {
  private pawnList: Pawn[] = [];
  private turn = 0;

  public getPawnList(): Pawn[] {
    return this.pawnList;
  }

  public changeTurn(): void {
    this.turn = (this.turn + 1) % this.pawnList.length;
  }

  public rollDice(): number {
    return Math.ceil(Math.random() * 6);
  }
}
