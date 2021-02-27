import { IBoard } from "@/models/Board";
import { GameEventPacket, Pawn, PawnColor, PowerUp } from "@/models/Game";
import { ITile, TileType } from "@/models/Tile";
import Container, { Service } from "typedi";

import { BoardService } from "./BoardService";
import { TileService } from "./TileService";
import { GameEvent } from "@/events/GameEvent";
import { GameConfig } from "@/config/GameConfig";
import { IProblem } from "@/models/Problem";

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
   *  Swap pawn position in list
   */
  public swapPawn(index1: number, index2: number): void {
    let pawn1 = this.pawnList[index1];
    let pawn2 = this.pawnList[index2];

    const tmp = pawn1;
    pawn1 = pawn2;
    pawn2 = tmp;
  }

  /**
   * Gets the current board.
   */
  public getBoard(): IBoard {
    return this.board;
  }

  /**
   * Gets the current turn.
   */
  public getTurn(): number {
    return this.turn;
  }

  public getEnemyTilesId(playerId: string): string[] {
    const ownedByOthers: string[] = [];

    this.pawnList.forEach((player) => {
      if (player.playerId !== playerId) {
        ownedByOthers.concat(player.property);
      }
    });

    return ownedByOthers;
  }

  /**
   * Check current turn. If player ID on the current turn is the same as supplied, will return true. Otherwise, false.
   */
  public isPlaying(playerId: string): boolean {
    return this.pawnList[this.turn].playerId === playerId;
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
   * Move the current pawn `value` count.
   * @param value number of tiles moved
   */
  public movePawnToIndex(index: number): void {
    this.pawnList[this.turn].position = index;
  }

  /**
   * Finds the first tile which holds the tile type and move the pawn there.
   */
  public movePawnToTileType(tileType: TileType): void {
    for (let i = 0; i < this.board.tiles.length; i++) {
      if ((this.board.tiles[i] as ITile).type === tileType) {
        this.pawnList[this.turn].position = i;
        return;
      }
    }
  }

  /**
   * Add new pawn from player ID
   * @param playerId Player ID that is going to be added
   */
  public addPawn(playerId: string, playerName: string): void {
    this.pawnList.push({
      playerId,
      playerName,
      color: PawnColor[Math.floor(Math.random() * PawnColor.length)],
      position: 0,
      totalPoints: 0,
      points: 0,
      property: [],
      prisonImmunity: 0,
      isPrisoner: false,
    });
  }

  /**
   * Remove pawn from player list
   * @param playerId Player ID that is going to be removed
   */
  public removePawn(playerId: string): void {
    this.pawnList = this.pawnList.filter((pawn) => pawn.playerId !== playerId);
  }

  /**
   * Add `value` points to the current playing player.
   * @param value The amoun of points added to the player.
   */
  public modifyPoints(playerIndex: number, value: number): void {
    this.pawnList[playerIndex].points += value;
  }

  /**
   * Set points for a player
   * @param playerIndex The player index
   * @param value The points
   */
  public setTotalPoints(playerIndex: number, value: number): void {
    this.pawnList[playerIndex].totalPoints = value;
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
    if (!currentTile.problem) {
      throw new Error("This ain't a property tile!");
    }
    return currentTile.problem as IProblem;
  }

  public getCurrentPoints(): number {
    return this.pawnList[this.turn].points;
  }

  // -=-=-=-=-= EVENT RELATED -=-=-=-=-=

  /**
   * On start turn, this is the chcker.
   */
  public onStartTurn(): GameEventPacket<string | number> {
    if (this.pawnList[this.turn].isPrisoner) {
      this.pawnList[this.turn].isPrisoner = false;
      return { eventName: GameEvent.END_TURN, body: "Currently in prison!" };
    } else {
      const [dice1, dice2] = this.rollTwoDice();
      return { eventName: GameEvent.MOVE, body: dice1 + dice2 };
    }
  }

  /**
   * Used when the pawn is going to be moved.
   * @param dice How many tiles move forward
   */
  public async onMove(dice: number): Promise<GameEventPacket<null>> {
    this.movePawn(dice);
    const pos: number = this.pawnList[this.turn].position;
    const currentTile: ITile = await Container.get(TileService).getOne(
      this.board.tiles[pos] as string
    );
    switch (currentTile.type) {
      case TileType.START:
        return { eventName: GameEvent.START_TILE };
      case TileType.JAIL:
        return { eventName: GameEvent.PRISON_TILE };
      case TileType.PARKING:
        return { eventName: GameEvent.FREE_PARKING_TILE };
      case TileType.PROPERTY:
        return { eventName: GameEvent.PROPERTY_TILE };
      case TileType.POWER_UP:
        return { eventName: GameEvent.POWER_UP_TILE };
      default:
        return { eventName: GameEvent.END_TURN };
    }
  }

  /**
   * Used when the pawn lands on the start tile
   */
  public onLandStart(): GameEventPacket<null> {
    return { eventName: GameEvent.END_TURN };
  }

  /**
   * Used when the pawn lands on a prison tile
   */
  public onLandPrison(): GameEventPacket<null> {
    const currentPawn: Pawn = this.pawnList[this.turn];
    if (currentPawn.prisonImmunity > 0) {
      currentPawn.prisonImmunity--;
      currentPawn.isPrisoner = false;
    } else {
      currentPawn.isPrisoner = true;
    }
    return { eventName: GameEvent.END_TURN };
  }

  /**
   * Used when the pawn lands on a free parking tile.
   */
  public onLandFreeParking(): GameEventPacket<ITile[]> {
    return {
      eventName: GameEvent.FREE_PARKING_PICK_TILE,
      body: this.board.tiles as ITile[],
    };
  }

  public onFreeParkingPickTile(index: number): GameEventPacket<null> {
    this.movePawnToIndex(index);
    const currentTile: ITile = this.board.tiles[
      this.pawnList[this.turn].position
    ] as ITile;
    switch (currentTile.type) {
      case TileType.START:
        return { eventName: GameEvent.START_TILE };
      case TileType.JAIL:
        return { eventName: GameEvent.PRISON_TILE };
      case TileType.PARKING:
        return { eventName: GameEvent.FREE_PARKING_TILE };
      case TileType.PROPERTY:
        return { eventName: GameEvent.PROPERTY_TILE };
      case TileType.POWER_UP:
        return { eventName: GameEvent.POWER_UP_TILE };
      default:
        return { eventName: GameEvent.END_TURN };
    }
  }

  /**
   * Used when the pawn landed on a property tile.
   */
  public onLandProperty(): GameEventPacket<null> {
    const currentTileId: string = this.getCurrentTileId();

    for (let i = 0; i < this.pawnList.length; i++) {
      if (this.pawnList[i].property.includes(currentTileId)) {
        return { eventName: GameEvent.END_TURN };
      }
    }

    return { eventName: GameEvent.GIVE_PROBLEM };
  }

  /**
   * Used when the pawn chooses to answer a problem.
   */
  public async onGiveProblem(): Promise<GameEventPacket<IProblem>> {
    const currentTile: ITile = await this.getCurrentTile();
    const problem: IProblem = currentTile.problem as IProblem;
    return { eventName: GameEvent.PROBLEM, body: problem };
  }

  public async onAnswerProblem(answer: number): Promise<GameEventPacket<null>> {
    const currentProblem = await this.getCurrentProblem();
    const isCorrect = answer === currentProblem.answer;
    if (isCorrect) {
      return { eventName: GameEvent.CORRECT_ANSWER };
    } else {
      return { eventName: GameEvent.WRONG_ANSWER };
    }
  }

  public onWrongAnswer(): GameEventPacket<null> {
    return { eventName: GameEvent.END_TURN };
  }

  public async onCorrectAnswer(): Promise<GameEventPacket<null>> {
    // Add property to list
    this.pawnList[this.turn].property.push(this.getCurrentTileId());

    const points = await this.calculatePropertyPoints(this.turn);
    this.setTotalPoints(this.turn, points + this.pawnList[this.turn].points);

    return { eventName: GameEvent.END_TURN };
  }

  public onLandPowerUp(): GameEventPacket<null> {
    switch (this.getRandomPowerUp()) {
      case PowerUp.ADD_POINTS:
        return { eventName: GameEvent.POWER_UP_GET_ADD_POINTS };
      case PowerUp.DISABLE_MULTIPLIER:
        return { eventName: GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER };
      case PowerUp.PRISON_IMMUNITY:
        return { eventName: GameEvent.POWER_UP_GET_PRISON };
      case PowerUp.REDUCE_POINTS:
        return { eventName: GameEvent.POWER_UP_GET_REDUCE_POINTS };
      default:
        return { eventName: GameEvent.END_TURN };
    }
  }

  public async onPowerUpAddPoints(
    added: number
  ): Promise<GameEventPacket<null>> {
    this.modifyPoints(this.turn, added);
    const points = await this.calculatePropertyPoints(this.turn);
    this.setTotalPoints(this.turn, points + this.pawnList[this.turn].points);
    console.log(this.pawnList);
    return { eventName: GameEvent.END_TURN };
  }

  public onPowerUpReducePoints(): GameEventPacket<Pawn[]> {
    return { eventName: GameEvent.POWER_UP_PICK_PLAYER, body: this.pawnList };
  }

  public onPowerUpDisableMultiplier(): GameEventPacket<null> {
    return { eventName: GameEvent.POWER_UP_PRE_PICK_PROPERTY };
  }

  public onPowerUpPrisonImmunity(): GameEventPacket<null> {
    this.pawnList[this.turn].prisonImmunity++;
    return { eventName: GameEvent.END_TURN };
  }

  public async onPowerUpPickPlayer(
    playerIndex: number,
    reducedPoints: number
  ): Promise<GameEventPacket<null>> {
    this.modifyPoints(playerIndex, reducedPoints);
    const points = await this.calculatePropertyPoints(playerIndex);
    this.setTotalPoints(this.turn, points + this.pawnList[playerIndex].points);
    return { eventName: GameEvent.END_TURN };
  }

  public onPowerUpPrePickProperty(): GameEventPacket<string[]> {
    const player: Pawn = this.pawnList[this.turn];
    return {
      eventName: GameEvent.POWER_UP_POST_PICK_PROPERTY,
      body: this.getEnemyTilesId(player.playerId),
    };
  }

  public async onPowerUpPostPickProperty(
    propertyId: string
  ): Promise<GameEventPacket<null>> {
    this.board.tiles.forEach((x) => {
      const tile: ITile = x;
      const tileId: string = x as string;
      if (tileId === propertyId) {
        tile.multiplier = 1;
      }
    });
    return { eventName: GameEvent.END_TURN };
  }

  /**
   * Used when the pawn ends the turn/ran out of time.
   */
  public onEndTurn(): GameEventPacket<null> {
    if (this.checkGameFinished()) {
      return { eventName: GameEvent.END_GAME };
    }
    this.changeTurn();
    return { eventName: GameEvent.START_TURN };
  }

  public checkGameFinished(): boolean {
    let propertyCount = 0;
    for (const tile of this.board.tiles)
      propertyCount += (tile as ITile).type === TileType.PROPERTY ? 1 : 0;
    let pawnPropertyCount = 0;
    for (const pawn of this.pawnList) pawnPropertyCount += pawn.property.length;

    return propertyCount === pawnPropertyCount;
  }

  public groupTiles(): { [key: string]: ITile[] } {
    const result = {};
    for (let tile of this.board.tiles) {
      tile = tile as ITile;
      if (tile.type !== TileType.PROPERTY) continue;
      result[tile.group] ??= [];
      (result[tile.group] as ITile[]).push(tile);
    }
    return result;
  }

  public async calculatePropertyPoints(pawnIndex: number): Promise<number> {
    let points = 0;

    const grouped = this.groupTiles();
    const groupedTilePlayer: { [key: string]: ITile[] } = {};
    for (const propId of this.pawnList[pawnIndex].property) {
      const prop = await Container.get(TileService).getOne(propId);
      groupedTilePlayer[prop.group] ??= [];
      (groupedTilePlayer[prop.group] as ITile[]).push(prop);
    }

    // Check per freq
    for (const key in groupedTilePlayer) {
      console.log(groupedTilePlayer);
      if (grouped[key].length === groupedTilePlayer[key].length) {
        const totalPoints = grouped[key]
          .map((tile) => tile.price)
          .reduce((total, tile) => total + tile);
        points += grouped[key][0].multiplier * totalPoints;
      } else {
        for (const tile of groupedTilePlayer[key]) {
          points += tile.price;
        }
      }
    }

    return points;
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
