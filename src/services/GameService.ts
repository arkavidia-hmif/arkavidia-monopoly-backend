import { IBoard } from "@/models/Board";
import { Pawn } from "@/models/Game";
import { ITile, TileType } from "@/models/Tile";
import Container, { Service } from "typedi";

import { BoardService } from "./BoardService";
import { TileService } from "./TileService";

@Service()
export class GameService {
  private pawnList: Pawn[] = [];
  private board: IBoard;
  private turn = 0;

  // public async initializeGame(boardId: string): Promise<void> {
  //   this.pawnList = [];
  //   this.board = await Container.get(BoardService).getOne(boardId);
  // }

  public getPawnList(): Pawn[] {
    return this.pawnList;
  }

  public changeTurn(): void {
    this.turn = (this.turn + 1) % this.pawnList.length;
  }

  public rollDie(): number {
    return Math.ceil(Math.random() * 6);
  }

  public rollTwoDice(): [number, number] {
    return [this.rollDie(), this.rollDie()];
  }

  public movePawn(value: number): void {
    this.pawnList[this.turn].position =
      (this.pawnList[this.turn].position + value) % this.board.tiles.length;
  }

  public addPawn(playerId: string): void {
    this.pawnList.push({ playerId, position: 0 });
  }

  public async tileAction(): Promise<void> {
    const currentTile: ITile = await Container.get(TileService).getOne(
      this.board.tiles[this.pawnList[this.turn].position]
    );
    switch (currentTile.type) {
      case TileType.START:
        return;
      // cash money?
      case TileType.JAIL:
        return;
      // no turn
      case TileType.PARKING:
        return;
      // select tile
      case TileType.PROPERTY:
        return;
      // beli2?
      case TileType.POWER_UP:
        return;
      // get random powerup
    }
  }
}
