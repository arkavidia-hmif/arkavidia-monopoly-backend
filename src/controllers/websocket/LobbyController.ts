import { LobbyEvent } from "@/events/LobbyEvent";
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
  public async connection(@SocketId() socketId: string): Promise<void> {
    console.info(`ℹ Client with id ${socketId} connected`);
  }

  @OnDisconnect()
  public disconnect(
    @SocketIO() io: Socket,
    @SocketId() socketId: string
  ): void {
    this.gameService.removePawn(socketId);
    console.info(`ℹ Client with id ${socketId} disconnected`);
    io.emit(LobbyEvent.GET_PLAYERS_IN_LOBBY, this.gameService.getPawnList());
  }

  @OnMessage(LobbyEvent.START)
  public startGame(
    @MessageBody() boardId: string,
    @SocketIO() io: Socket
  ): void {
    this.gameService.initializeGame(boardId).then(() => {
      io.emit(LobbyEvent.GAME_STARTED, this.gameService.getBoard());
    });
  }

  @OnMessage(LobbyEvent.GET_PLAYERS_IN_LOBBY)
  public getPlayersInLobby(@SocketIO() io: Socket): void {
    io.emit(LobbyEvent.GET_PLAYERS_IN_LOBBY, this.gameService.getPawnList());
    // return this.gameService.getPawnList();
  }

  @OnMessage(LobbyEvent.ADD_PLAYER)
  public addPlayer(
    @SocketIO() io: Socket,
    @SocketId() socketId: string,
    @MessageBody() playerName: string
  ): void {
    this.gameService.addPawn(socketId, playerName);
    io.emit(LobbyEvent.GET_PLAYERS_IN_LOBBY, this.gameService.getPawnList());
  }
}
