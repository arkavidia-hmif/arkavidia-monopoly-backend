import { LobbyEvent } from "@/events/LobbyEvent";
import { Pawn } from "@/models/Game";
import { GameService } from "@/services/GameService";
import {
  // ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
} from "socket-controllers";

@SocketController()
export class LobbyController {
  constructor(private gameService: GameService) {}

  @OnConnect()
  public async connection(): Promise<void> {
    console.info("Client connected");
  }

  @OnDisconnect()
  public async disconnect(): Promise<void> {
    console.info("Client disconnected");
  }

  @OnMessage(LobbyEvent.START)
  @EmitOnSuccess(LobbyEvent.GAME_STARTED)
  public async startGame(): Promise<void> {
    // this.gameService.initializeGame();
    return;
  }

  @OnMessage(LobbyEvent.ADD_PLAYER)
  @EmitOnSuccess(LobbyEvent.GET_PLAYERS_IN_LOBBY)
  public async addPlayer(@MessageBody() playerId: string): Promise<Pawn[]> {
    this.gameService.addPawn(playerId);
    return this.gameService.getPawnList();
  }
}
