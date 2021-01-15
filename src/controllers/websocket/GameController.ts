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
    socket.emit(await this.gameService.onMove(tilesMoved));
  }

  @OnMessage(GameEvent.END_TURN)
  public onEndTurn(@SocketIO() socket: Server): void {
    socket.emit(this.gameService.onEndTurn());
  }

  @OnMessage(GameEvent.PROPERTY_TILE)
  public onLandPropertyTile(@SocketIO() socket: Server): void {
    socket.emit(this.gameService.onLandProperty());
  }

  @OnMessage(GameEvent.GIVE_PROBLEM)
  public async onGiveProblem(@SocketIO() socket: Server): Promise<void> {
    const problem = await this.gameService.onGiveProblem();
    socket.emit(problem.event, problem.body);
  }

  @OnMessage(GameEvent.ANSWER_PROBLEM)
  public async onAnswerProblem(
    @SocketIO() socket: Server,
    @MessageBody() answer: number
  ): Promise<void> {
    socket.emit(await this.gameService.onAnswerProblem(answer));
  }

  @OnMessage(GameEvent.CORRECT_ANSWER)
  public onCorrectAnswer(@SocketIO() socket: Server): void {
    socket.emit(this.gameService.onCorrectAnswer());
  }

  @OnMessage(GameEvent.WRONG_ANSWER)
  public onWrongAnswer(@SocketIO() socket: Server): void {
    socket.emit(this.gameService.onWrongAnswer());
  }

  @OnMessage(GameEvent.PRISON_TILE)
  public onLandPrison(@SocketIO() socket: Server): void {
    socket.emit(this.gameService.onLandPrison());
  }

  @OnMessage(GameEvent.POWER_UP_TILE)
  public onLandPowerUp(@SocketIO() socket: Server): void {
    socket.emit(this.gameService.onLandPowerUp());
  }
}
