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
  @EmitOnSuccess(LobbyEvent.GET_PLAYERS_IN_LOBBY)
  public async disconnect(@SocketId() socketId: string): Promise<void> {
    // FIXME: kick player maybe?
    this.gameService.removePawn(socketId);
    console.info("Client disconnected");
  }

  @OnMessage(LobbyEvent.START)
  public startGame(
    @MessageBody() boardId: string,
    @SocketIO() socket: Socket
  ): void {
    this.gameService.initializeGame(boardId).then(() => {
      socket.emit(LobbyEvent.GAME_STARTED, this.gameService.getBoard());
    });
  }

  @OnMessage(LobbyEvent.GET_PLAYERS_IN_LOBBY)
  public getPlayersInLobby(@SocketIO() socket: Socket): void {
    socket.emit(
      LobbyEvent.GET_PLAYERS_IN_LOBBY,
      this.gameService.getPawnList()
    );
    // return this.gameService.getPawnList();
  }

  @OnMessage(LobbyEvent.ADD_PLAYER)
  public addPlayer(
    @SocketIO() socket: Socket,
    @SocketId() socketId: string,
    @MessageBody() playerName: string
  ): void {
    this.gameService.addPawn(socketId, playerName);
    socket.emit(
      LobbyEvent.GET_PLAYERS_IN_LOBBY,
      this.gameService.getPawnList()
    );
  }
}
