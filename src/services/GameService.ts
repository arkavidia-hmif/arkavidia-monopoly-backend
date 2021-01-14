import { IBoard } from "@/models/Board";
import { Pawn, PowerUp } from "@/models/Game";
import { ITile, TileType } from "@/models/Tile";
import Container, { Service } from "typedi";

import { BoardService } from "./BoardService";
import { TileService } from "./TileService";
import Configuration from "@/configuration/Game";

@Service()
export class GameService {
  private pawnList: Pawn[] = [];
  private board: IBoard;
  private turn = 0;

  public async initializeGame(boardId: string): Promise<void> {
    this.pawnList = [];
    this.board = await Container.get(BoardService).getOne(boardId);
  }

  public getPawnList(): Pawn[] {
    return this.pawnList;
  }

  public changeTurn(): void {
    this.turn = (this.turn + 1) % this.pawnList.length;
  }

  public rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  public rollTwoDice(): [number, number] {
    return [this.rollDie(), this.rollDie()];
  }

  public movePawn(value: number): void {
    this.pawnList[this.turn].position =
      (this.pawnList[this.turn].position + value) % this.board.tiles.length;
  }

  public addPawn(playerId: string): void {
    this.pawnList.push({
      playerId,
      position: 0,
      score: 0,
      property: [],
      prisonImmunity: 0,
      isPrisoner: false,
    });
  }

  public getRandomPowerUp(): PowerUp {
    const powerUpArr = Object.keys(PowerUp)
      .map((e) => Number.parseInt(e))
      .filter((e) => !Number.isNaN(e));
    return powerUpArr[Math.floor(Math.random() * powerUpArr.length)];
  }

  // FIX : gatau bener ato ngga
  public async tileEffect(): Promise<void> {
    const currentPawn: Pawn = this.pawnList[this.turn];
    const currentTile: ITile = await Container.get(TileService).getOne(
      this.board.tiles[currentPawn.position] as string
    );
    switch (currentTile.type) {
      case TileType.START:
        currentPawn.score += Configuration.startScore;
        return;
      case TileType.JAIL:
        currentPawn.isPrisoner = true;
        if (currentPawn.prisonImmunity > 0) {
          currentPawn.prisonImmunity--;
          currentPawn.isPrisoner = false;
        }
        return;
      case TileType.PARKING:
        // select tile
        return;
      case TileType.PROPERTY:
        // kalau ini punya orang, ngurangin score?
        // else, kesini
        // ambil problem
        // taruh di pawn
        return;
      case TileType.POWER_UP:
        const pu: PowerUp = this.getRandomPowerUp();

        return;
      default:
        return;
    }
  }
}

/*
DFA PLAYER TURN
1. roll dice <- mau dibikin mencet tombol/otomatis, kalau otomatis kayak nonton jadinya
2. kasus 1: start, jail -> langsung end turn
   kasus 2: parking -> lompat ke 4
   kasus 3: property -> bisa langsung end turn kalau punya orang, kalau mau beli, lompat ke 5
   kasus 4: power up -> kalau dapet add, end turn
                        kalau dapet remove, lompat ke 5
                        kalau dapet jail, end turn
                        kalau dapet multiplier matiin, lompat ke 6
3. milih kemana
4. jawab soal
5. Pilih orang yang dikurangin
6. milih apa yg mau dimatiin
*/
