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

  @OnMessage(GameEvent.PAWN_LIST)
  // @EmitOnSuccess(GameEvent.PAWN_LIST)
  public onRequestPawnList(@SocketIO() io: Server): void {
    io.emit(GameEvent.PAWN_LIST, this.gameService.getPawnList());
    // return this.gameService.getPawnList();
  }

  @OnMessage(GameEvent.START_TURN)
  @EmitOnSuccess(GameEvent.MOVE)
  @EmitOnFail(GameEvent.INVALID_TURN)
  public onStartTurn(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): number {
    io.emit(GameEvent.PAWN_LIST, this.gameService.getPawnList());
    if (!this.gameService.isPlaying(playerId)) throw new Error("Invalid turn!");

    const [dice1, dice2] = this.gameService.rollTwoDice();
    return dice1 + dice2;
  }

  @OnMessage(GameEvent.MOVE)
  public async onMove(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() tilesMoved: number
  ): Promise<void> {
    io.emit(GameEvent.PAWN_LIST, this.gameService.getPawnList());

    if (!this.gameService.isPlaying(playerId)) throw new Error("Invalid turn!");

    const gameEvent = await this.gameService.onMove(tilesMoved);
    io.to(playerId).emit(gameEvent.eventName);
  }

  @OnMessage(GameEvent.END_TURN)
  public onEndTurn(@SocketIO() io: Server, @SocketId() playerId: string): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onEndTurn();
      io.emit(gameEvent.eventName, this.gameService.getTurn());
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.PROPERTY_TILE)
  public onLandPropertyTile(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onLandProperty();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.GIVE_PROBLEM)
  public onGiveProblem(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      this.gameService.onGiveProblem().then((gameEvent) => {
        io.emit(gameEvent.eventName, gameEvent.body);
      });
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.ANSWER_PROBLEM)
  public async onAnswerProblem(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() answer: number
  ): Promise<void> {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = await this.gameService.onAnswerProblem(answer);
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.CORRECT_ANSWER)
  public onCorrectAnswer(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onCorrectAnswer();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.WRONG_ANSWER)
  public onWrongAnswer(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onWrongAnswer();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.PRISON_TILE)
  public onLandPrison(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onLandPrison();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_TILE)
  public onLandPowerUp(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onLandPowerUp();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_GET_ADD_POINTS)
  public onPowerUpAddPoints(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpAddPoints();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_GET_REDUCE_POINTS)
  public onPowerUpReducePoints(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpReducePoints();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_PICK_PLAYER)
  public onPowerUpPickPlayer(
    @SocketIO() io: Server,
    @SocketId() playerId: string,
    @MessageBody() playerIndex: number
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpPickPlayer(playerIndex);
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER)
  public onPowerUpDisableMultiplier(
    @SocketIO() io: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpDisableMultiplier();
      io.emit(gameEvent.eventName);
    } else {
      io.emit(GameEvent.INVALID_TURN);
    }
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
