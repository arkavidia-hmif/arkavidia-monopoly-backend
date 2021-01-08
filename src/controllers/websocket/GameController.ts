import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
} from "socket-controllers";
import { Socket } from "socket.io";

@SocketController("/game")
export class GameController {
  @OnConnect()
  public async connection(): Promise<void> {
    console.log("Client connected");
  }

  @OnDisconnect()
  public async disconnect(): Promise<void> {
    console.log("Client disconnected");
  }

  @OnMessage("start")
  public async startGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string
  ): Promise<void> {
    console.log("received");
    console.log("received message:", message);
    // console.log("setting id to the message and sending it back to the client");
    // message.id = 1;
    // socket.emit("game_started", message);
  }
}
