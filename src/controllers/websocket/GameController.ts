import { GameEvent } from "@/events/GameEvent";
import { GameService } from "@/services/GameService";
import {
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

  @OnMessage(GameEvent.START_TURN)
  // @EmitOnSuccess(GameEvent.MOVE)
  public onStartTurn(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const [dice1, dice2] = this.gameService.rollTwoDice();
      socket.emit(GameEvent.MOVE, dice1 + dice2);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
    // return;
  }

  @OnMessage(GameEvent.MOVE)
  public async onMove(
    @SocketIO() socket: Server,
    @SocketId() playerId: string,
    @MessageBody() tilesMoved: number
  ): Promise<void> {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = await this.gameService.onMove(tilesMoved);
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.END_TURN)
  public onEndTurn(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onEndTurn();
      socket.emit(gameEvent.eventName, this.gameService.getTurn());
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.PROPERTY_TILE)
  public onLandPropertyTile(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onLandProperty();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.GIVE_PROBLEM)
  public onGiveProblem(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      this.gameService.onGiveProblem().then((gameEvent) => {
        socket.emit(gameEvent.eventName, gameEvent.body);
      });
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.ANSWER_PROBLEM)
  public async onAnswerProblem(
    @SocketIO() socket: Server,
    @SocketId() playerId: string,
    @MessageBody() answer: number
  ): Promise<void> {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = await this.gameService.onAnswerProblem(answer);
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.CORRECT_ANSWER)
  public onCorrectAnswer(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onCorrectAnswer();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.WRONG_ANSWER)
  public onWrongAnswer(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onWrongAnswer();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.PRISON_TILE)
  public onLandPrison(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onLandPrison();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_TILE)
  public onLandPowerUp(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onLandPowerUp();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_GET_ADD_POINTS)
  public onPowerUpAddPoints(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpAddPoints();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_GET_REDUCE_POINTS)
  public onPowerUpReducePoints(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpReducePoints();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_PICK_PLAYER)
  public onPowerUpPickPlayer(
    @SocketIO() socket: Server,
    @SocketId() playerId: string,
    @MessageBody() playerIndex: number
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpPickPlayer(playerIndex);
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }

  @OnMessage(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER)
  public onPowerUpDisableMultiplier(
    @SocketIO() socket: Server,
    @SocketId() playerId: string
  ): void {
    if (this.gameService.isPlaying(playerId)) {
      const gameEvent = this.gameService.onPowerUpDisableMultiplier();
      socket.emit(gameEvent.eventName);
    } else {
      socket.emit(GameEvent.INVALID_TURN);
    }
  }
}
