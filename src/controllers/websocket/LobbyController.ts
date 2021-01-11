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

  @OnMessage("LOBBY_start")
  @EmitOnSuccess("LOBBY_gameStarted")
  public async startGame(): Promise<void> {
    // this.gameService.initializeGame();
    return;
  }

  @OnMessage("LOBBY_addPlayer")
  @EmitOnSuccess("LOBBY_playersInLobby")
  public async addPlayer(@MessageBody() playerId: string): Promise<Pawn[]> {
    this.gameService.addPawn(playerId);
    return this.gameService.getPawnList();
  }
}
