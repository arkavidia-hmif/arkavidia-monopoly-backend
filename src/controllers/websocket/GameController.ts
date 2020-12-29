import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
} from "socket-controllers";

@SocketController("/game")
export class GameController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
    console.log("client connected");
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    console.log("client disconnected");
  }

  @OnMessage("save")
  save(@ConnectedSocket() socket: any) {
    console.log("received");
    // console.log("received message:", message);
    // console.log("setting id to the message and sending it back to the client");
    // message.id = 1;
    // socket.emit("message_saved", message);
  }
}