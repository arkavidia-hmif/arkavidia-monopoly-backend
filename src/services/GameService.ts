import { IBoard } from "@/models/Board";
import { Pawn, PowerUp } from "@/models/Game";
import { ITile, TileType } from "@/models/Tile";
import Container, { Service } from "typedi";

import { BoardService } from "./BoardService";
import { TileService } from "./TileService";
import { GameEvent } from "@/events/GameEvent";
import { GameConfig } from "@/config/GameConfig";
import { IProblem } from "@/models/Problem";
import { ProblemService } from "./ProblemService";

@Service()
export class GameService {
  private pawnList: Pawn[] = [];
  private board: IBoard;
  private turn = 0;

  /**
   * Initialize board at the start on the game.
   * @param boardId The board ID used for the game.
   */
  public async initializeGame(boardId: string): Promise<void> {
    this.board = await Container.get(BoardService).getOne(boardId);
    this.turn = 0;
    return;
  }

  /**
   * Gets pawn list.
   */
  public getPawnList(): Pawn[] {
    return this.pawnList;
  }

  /**
   * Gets the current board.
   */
  public getBoard(): IBoard {
    return this.board;
  }

  /**
   * Change to the next turn. Turn has the value of `[0..pawnList.length-1]`.
   */
  public changeTurn(): void {
    this.turn = (this.turn + 1) % this.pawnList.length;
  }

  /**
   * Generates a random number from 1-6 uniformly as a normal six-sided die would do.
   */
  public rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Rolls two six-sided dice.
   */
  public rollTwoDice(): [number, number] {
    return [this.rollDie(), this.rollDie()];
  }

  /**
   * Move the current pawn `value` count.
   * @param value number of tiles moved
   */
  public movePawn(value: number): void {
    this.pawnList[this.turn].position =
      (this.pawnList[this.turn].position + value) % this.board.tiles.length;
  }

  /**
   * Add new pawn from player ID
   * @param playerId add new pawn from player ID
   */
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

  public removePawn(playerId: string): void {
    this.pawnList.filter((pawn) => pawn.playerId != playerId);
  }

  /**
   * Add `value` points to the current playing player.
   * @param value The amoun of points added to the player.
   */
  public addPoints(value: number): void {
    this.pawnList[this.turn].score += value;
  }

  /**
   * Get random power-up from the PowerUp interface.
   */
  public getRandomPowerUp(): PowerUp {
    const powerUpArr = Object.keys(PowerUp)
      .map((e) => Number.parseInt(e))
      .filter((e) => !Number.isNaN(e));
    return powerUpArr[Math.floor(Math.random() * powerUpArr.length)];
  }

  /**
   * Get current tile ID from the current pawn.
   */
  public getCurrentTileId(): string {
    return this.board.tiles[this.pawnList[this.turn].position] as string;
  }

  /**
   * Get current tile from the tile service.
   */
  public async getCurrentTile(): Promise<ITile> {
    return await Container.get(TileService).getOne(this.getCurrentTileId());
  }

  /**
   * Get current problem from the current tile.
   */
  public async getCurrentProblem(): Promise<IProblem> {
    const currentTile = await this.getCurrentTile();
    if (!currentTile.problemId) {
      throw new Error("This ain't a property tile!");
    }

    const currentProblem = await Container.get(ProblemService).getOne(
      currentTile.problemId
    );
    return currentProblem;
  }

  /**
   * Used when the pawn is going to be moved.
   * @param dice How many tiles move forward
   */
  public async onMove(dice: number): Promise<string> {
    this.movePawn(dice);
    const pos: number = this.pawnList[this.turn].position;
    const currentTile: ITile = await Container.get(TileService).getOne(
      this.board.tiles[pos] as string
    );
    switch (currentTile.type) {
      case TileType.START:
        return GameEvent.START_TILE;
      case TileType.JAIL:
        return GameEvent.PRISON_TILE;
      case TileType.PARKING:
        return GameEvent.FREE_PARKING_TILE;
      case TileType.PROPERTY:
        return GameEvent.PROPERTY_TILE;
      case TileType.POWER_UP:
        return GameEvent.POWER_UP_GET_ADD_POINTS;
      default:
        return GameEvent.END_TURN;
    }
  }

  // TODO: fix pass by start
  public onLandStart(): string {
    return GameEvent.END_TURN;
  }

  /**
   * Used when the pawn lands on a prison tile
   */
  public onLandPrison(): string {
    const currentPawn: Pawn = this.pawnList[this.turn];
    if (currentPawn.prisonImmunity > 0) {
      currentPawn.prisonImmunity--;
      currentPawn.isPrisoner = false;
    }
    return GameEvent.END_TURN;
  }

  /**
   * Used when the pawn lands on a free parking tile.
   */
  public onLandFreeParking(): string {
    return GameEvent.FREE_PARKING_PICK_TILE;
  }

  /**
   * Used when the pawn ends the turn/ran out of time.
   */
  public onEndTurn(): string {
    this.changeTurn();
    return GameEvent.START_TURN;
  }

  /**
   * Used when the pawn landed on a property tile.
   */
  public onLandProperty(): string {
    const currentTileId: string = this.getCurrentTileId();

    for (let i = 0; i < this.pawnList.length; i++) {
      if (this.pawnList[i].property.includes(currentTileId)) {
        return GameEvent.END_TURN;
      }
    }

    return GameEvent.GIVE_PROBLEM;
  }

  /**
   * Used when the pawn chooses to answer a problem.
   */
  public async onGiveProblem(): Promise<{ event: string; body: IProblem }> {
    const currentTile: ITile = await this.getCurrentTile();
    const problem: IProblem = await Container.get(ProblemService).getOne(
      currentTile.problemId
    );
    // FIXME: belom bener, return problem sama event
    return { event: GameEvent.PROBLEM, body: problem };
  }

  public async onAnswerProblem(answer: number): Promise<string> {
    const isCorrect = answer === (await this.getCurrentProblem()).answer;
    if (isCorrect) {
      return GameEvent.CORRECT_ANSWER;
    } else {
      return GameEvent.WRONG_ANSWER;
    }
  }

  public onWrongAnswer(): string {
    return GameEvent.END_TURN;
  }

  public onCorrectAnswer(): string {
    this.addPoints(GameConfig.CORRECT_ANSWER_POINTS);
    return GameEvent.END_TURN;
  }

  public onLandPowerUp(): string {
    switch (this.getRandomPowerUp()) {
      case PowerUp.ADD_POINTS:
        return GameEvent.POWER_UP_GET_ADD_POINTS;
      case PowerUp.DISABLE_MULTIPLIER:
        return GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER;
      case PowerUp.PRISON_IMMUNITY:
        return GameEvent.POWER_UP_GET_PRISON;
      case PowerUp.REDUCE_POINTS:
        return GameEvent.POWER_UP_GET_REDUCE_POINTS;
    }
  }

  public onPickPlayer(): string {
    return GameEvent.POWER_UP_PICK_PLAYER;
  }

  // TODO: implement check game finished
  public checkGameFinished(): void {
    return;
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
