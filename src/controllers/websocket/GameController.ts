import { GameEvent } from "@/events/GameEvent";
import { GameService } from "@/services/GameService";
import {
  EmitOnSuccess,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server } from "socket.io";

@SocketController()
export class GameController {
  constructor(private gameService: GameService) {}

  @OnMessage(GameEvent.START_TURN)
  @EmitOnSuccess(GameEvent.MOVE)
  public onStartTurn(): void {
    return;
  }

  @OnMessage(GameEvent.MOVE)
  public async onMove(
    @SocketIO() socket: Server,
    @MessageBody() tilesMoved: number
  ): Promise<void> {
    const gameEvent = await this.gameService.onMove(tilesMoved);
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.END_TURN)
  public onEndTurn(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onEndTurn();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.PROPERTY_TILE)
  public onLandPropertyTile(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onLandProperty();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.GIVE_PROBLEM)
  public async onGiveProblem(@SocketIO() socket: Server): Promise<void> {
    const gameEvent = await this.gameService.onGiveProblem();
    socket.emit(gameEvent.eventName, gameEvent.body);
  }

  @OnMessage(GameEvent.ANSWER_PROBLEM)
  public async onAnswerProblem(
    @SocketIO() socket: Server,
    @MessageBody() answer: number
  ): Promise<void> {
    const gameEvent = await this.gameService.onAnswerProblem(answer);
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.CORRECT_ANSWER)
  public onCorrectAnswer(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onCorrectAnswer();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.WRONG_ANSWER)
  public onWrongAnswer(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onWrongAnswer();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.PRISON_TILE)
  public onLandPrison(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onLandPrison();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_TILE)
  public onLandPowerUp(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onLandPowerUp();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_ADD_POINTS)
  public onPowerUpAddPoints(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onPowerUpAddPoints();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_REDUCE_POINTS)
  public onPowerUpReducePoints(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onPowerUpReducePoints();
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_PICK_PLAYER)
  public onPowerUpPickPlayer(
    @SocketIO() socket: Server,
    @MessageBody() playerIndex: number
  ): void {
    const gameEvent = this.gameService.onPowerUpPickPlayer(playerIndex);
    socket.emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER)
  public onPowerUpDisableMultiplier(@SocketIO() socket: Server): void {
    const gameEvent = this.gameService.onPowerUpDisableMultiplier();
    socket.emit(gameEvent.eventName);
  }
}
