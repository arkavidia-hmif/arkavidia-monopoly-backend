import { LobbyEvent } from "@/events/LobbyEvent";
import { GameService } from "@/services/GameService";
import {
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket } from "socket.io";
import Container from "typedi";

@SocketController("/admin")
export class AdminController {
  constructor(private gameService: GameService) {}

  /**
   * Force disconnect all clients and clean gameservice
   * @param io SocketIO instance
   */
  public resetGameService(@SocketIO() io: Socket): void {
    Container.reset(GameService);
    io.emit("disconnect");
  }

  /**
   * Reorder players in lobby for turn
   * @param io SocketIO instance
   * @param body Player indexes to be swapped
   */
  public reorderPlayer(
    @SocketIO() io: Socket,
    @MessageBody()
    body: { firstPawn: number; secondPawn: number }
  ): void {
    this.gameService.swapPawn(body.firstPawn, body.secondPawn);
    io.emit(LobbyEvent.GET_PLAYERS_IN_LOBBY);
  }

  /**
   * Start game
   * @param boardId Board ID that is used for the game
   * @param io SocketIO instance
   */
  @OnMessage(LobbyEvent.START)
  public startGame(
    @MessageBody() boardId: string,
    @SocketIO() io: Socket
  ): void {
    this.gameService.initializeGame(boardId).then(() => {
      io.emit(LobbyEvent.GAME_STARTED, this.gameService.getBoard());
    });
  }
}
