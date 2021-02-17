import { GameEvent } from "@/events/GameEvent";
import { Pawn } from "@/models/Game";
import { GameService } from "@/services/GameService";
import {
  EmitOnFail,
  EmitOnSuccess,
  MessageBody,
  OnMessage,
  SocketController,
  SocketId,
  SocketIO,
} from "socket-controllers";
import { Server } from "socket.io";

@SocketController()
export class GameController {
  constructor(private gameService: GameService) {}

  private verifyTurn(io: Server, playerId: string) {
    io.emit(GameEvent.PAWN_LIST, this.gameService.getPawnList());
    if (!this.gameService.isPlaying(playerId)) throw new Error("Invalid turn!");
  }

  /**
   * On start turn, allows the player on the correct turn to move whilst invalidating the player with incorrect turn.
   * @param io SocketIO instance
   * @param playerId Socket ID for the player ID
   */
  @OnMessage(GameEvent.START_TURN)
  @EmitOnSuccess(GameEvent.MOVE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onStartTurn(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): number {
    this.verifyTurn(io, playerId);
    const [dice1, dice2] = this.gameService.rollTwoDice();
    return dice1 + dice2;
  }

  /**
   * On receive move event, player will move with the amount of tiles given from the client.
   * @param io SocketIO instance
   * @param playerId Socket ID for the player ID
   * @param tilesMoved Number of tiles the player has to move
   */
  @OnMessage(GameEvent.MOVE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onMove(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() tilesMoved: number
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onMove(tilesMoved);
    io.to(playerId).emit(gameEvent.eventName);
  }

  /**
   * On receive event on end turn, change turn
   * @param io SocketIO instance
   * @param playerId Socket ID for the player ID
   */
  @OnMessage(GameEvent.END_TURN)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onEndTurn(@SocketIO() io: Server, @SocketId() playerId: string): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onEndTurn();
    io.emit(gameEvent.eventName);
  }

  /**
   * On player landed on property tile,
   * @param io SocketIO instance
   * @param playerId Socket ID for the player ID
   */
  @OnMessage(GameEvent.PROPERTY_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onLandPropertyTile(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onLandProperty();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.GIVE_PROBLEM)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onGiveProblem(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    this.gameService.onGiveProblem().then((gameEvent) => {
      io.emit(gameEvent.eventName, gameEvent.body);
    });
  }

  @OnMessage(GameEvent.ANSWER_PROBLEM)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onAnswerProblem(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() answer: number
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onAnswerProblem(answer);
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.CORRECT_ANSWER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onCorrectAnswer(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onCorrectAnswer();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.WRONG_ANSWER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onWrongAnswer(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onWrongAnswer();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.PRISON_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onLandPrison(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onLandPrison();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onLandPowerUp(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onLandPowerUp();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_ADD_POINTS)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpAddPoints(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpAddPoints();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_REDUCE_POINTS)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpReducePoints(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpReducePoints();
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_PICK_PLAYER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpPickPlayer(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() playerIndex: number
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpPickPlayer(playerIndex);
    io.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpDisableMultiplier(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpDisableMultiplier();
    io.emit(gameEvent.eventName);
  }

  // @OnMessage(GameEvent.POWER_UP_PICK_PROPERTY)
  // public onPowerUpPickProperty(
  //   @SocketIO() io: Server,
  //   @SocketId() playerId: string,
  //   @MessageBody() propertyIndex: number
  // ): void {
  //   if (this.gameService.isPlaying(playerId)) {
  //     const gameEvent = this.gameService.onPowerUpPickProperty(propertyIndex);
  //     socket.emit(gameEvent.eventName);
  //   } else {
  //     socket.emit(GameEvent.INVALID_TURN);
  //   }
  // }
}
