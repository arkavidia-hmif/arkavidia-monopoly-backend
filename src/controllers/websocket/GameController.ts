import { GameEvent } from "@/events/GameEvent";
import { GameService } from "@/services/GameService";
import {
  EmitOnFail,
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

  /**
   * Verify player turn by their player ID
   * @param io SocketIO instance
   * @param playerId Socket ID as player ID
   */
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
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onStartTurn(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onStartTurn();
    io.to(playerId).emit(gameEvent.eventName, gameEvent.body);
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
  public async onEndTurn(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onEndTurn();
    io.emit(gameEvent.eventName);
  }

  /**
   * On player landed on property tile, give them the problem
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
    io.to(playerId).emit(gameEvent.eventName);
  }

  /**
   * On request to give problem, return back problem
   * @param io SocketIO instance
   * @param playerId Socket ID for the player ID
   */
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

  /**
   * On answer prblem, return verdict
   * @param io SocketIO instance
   * @param playerId Socket ID as player ID
   * @param answer The answer given from the player
   */
  @OnMessage(GameEvent.ANSWER_PROBLEM)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onAnswerProblem(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() answer: number
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onAnswerProblem(answer);
    io.to(playerId).emit(gameEvent.eventName);
  }

  /**
   * On correct answer, add
   * @param io SocketIO instance
   * @param playerId Sokcet ID as player ID
   */
  @OnMessage(GameEvent.CORRECT_ANSWER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onCorrectAnswer(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onCorrectAnswer();
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.WRONG_ANSWER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onWrongAnswer(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onWrongAnswer();
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.PRISON_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onLandPrison(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onLandPrison();
    io.to(playerId).emit(gameEvent.eventName);
  }

  /**
   * On land power up tile, return random power up
   * @param io SocketIO instance
   * @param playerId Socket ID as player ID
   */
  @OnMessage(GameEvent.POWER_UP_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onLandPowerUp(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onLandPowerUp();
    io.to(playerId).emit(gameEvent.eventName);
  }

  /**
   * On get power up to add points, add points
   * @param io SocketIO instance
   * @param playerId Socket ID as player ID
   */
  @OnMessage(GameEvent.POWER_UP_GET_ADD_POINTS)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onPowerUpAddPoints(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() points: number
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onPowerUpAddPoints(points);
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_REDUCE_POINTS)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpReducePoints(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpReducePoints();
    io.to(playerId).emit(gameEvent.eventName, gameEvent.body);
  }

  @OnMessage(GameEvent.POWER_UP_PICK_PLAYER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onPowerUpPickPlayer(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody()
    { playerIndex, points }: { playerIndex: number; points: number }
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onPowerUpPickPlayer(
      playerIndex,
      points
    );
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_PRISON)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpGetPrison(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpPrisonImmunity();
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpDisableMultiplier(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpDisableMultiplier();
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_PRE_PICK_PROPERTY)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onPowerUpPickProperty(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onPowerUpPrePickProperty();
    io.to(playerId).emit(gameEvent.eventName, gameEvent.body);
  }

  @OnMessage(GameEvent.POWER_UP_POST_PICK_PROPERTY)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onPowerUpPostPickProperty(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() propertyId: string
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = await this.gameService.onPowerUpPostPickProperty(
      propertyId
    );
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.FREE_PARKING_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onLandFreeParking(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onLandFreeParking();
    io.to(playerId).emit(gameEvent.eventName, gameEvent.body);
  }

  @OnMessage(GameEvent.FREE_PARKING_PICK_TILE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public async onFreeParkingPickTile(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() tileIndex: number
  ): Promise<void> {
    this.verifyTurn(io, playerId);
    const gameEvent = this.gameService.onFreeParkingPickTile(tileIndex);
    io.to(playerId).emit(gameEvent.eventName, gameEvent.body);
  }
}
