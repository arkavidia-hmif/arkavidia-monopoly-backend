import {
  // ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
} from "socket-controllers";
// import { Socket } from "socket.io";

@SocketController()
export class GameController {
  @OnConnect()
  public async connection(): Promise<void> {
    console.info("Client connected");
    // socket.emit("lobby");
  }

  @OnDisconnect()
  public async disconnect(): Promise<void> {
    console.info("Client disconnected");
  }

  @OnMessage("start")
  @EmitOnSuccess("lala")
  public async startGame(@MessageBody() message: string): Promise<string> {
    console.info("received message:", message);
    return message.repeat(23);
    // io.emit("lala", message);
    // console.info("setting id to the message and sending it back to the client");
    // message.id = 1;
    // socket.emit("game_started", message);
  }
}
