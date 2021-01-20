import { LobbyEvent } from "@/events/LobbyEvent";
import { Pawn } from "@/models/Game";
import { GameService } from "@/services/GameService";
import {
  EmitOnSuccess,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketId,
  SocketIO,
} from "socket-controllers";
import { Socket } from "socket.io";

@SocketController()
export class LobbyController {
  constructor(private gameService: GameService) {}

  @OnConnect()
  public async connection(): Promise<void> {
    console.info("Client connected");
  }

  @OnDisconnect()
  public async disconnect(): Promise<void> {
    // FIXME: kick player maybe?
    console.info("Client disconnected");
  }

  @OnMessage(LobbyEvent.START)
  // @EmitOnSuccess(LobbyEvent.GAME_STARTED)
  public startGame(
    @MessageBody() boardId: string,
    @SocketIO() socket: Socket
  ): void {
    this.gameService.initializeGame(boardId).then(() => {
      socket.emit(LobbyEvent.GAME_STARTED, this.gameService.getBoard());
    });
  }

  @OnMessage(LobbyEvent.ADD_PLAYER)
  @EmitOnSuccess(LobbyEvent.GET_PLAYERS_IN_LOBBY)
  public addPlayer(@SocketId() socketId: string): Pawn[] {
    this.gameService.addPawn(socketId);
    return this.gameService.getPawnList();
  }
}
