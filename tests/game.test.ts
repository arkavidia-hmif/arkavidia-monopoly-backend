// import { env } from "@/env";
import { io as ioServer, server as httpServer, start } from "@/app";
import { env } from "@/env";
import { io, Socket } from "socket.io-client";

let socket: Socket;

beforeAll(async (done) => {
  await start();
  done();
});

beforeEach((done) => {
  console.log(httpServer.address());
  // console.log(`http://${httpServer.address().address}:${env.port}/`);
  socket = io(`http://localhost:${env.port}/`);
  socket.on("connect", () => {
    console.log("connected");
    done();
  });
});

afterEach((done) => {
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});

afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

describe("Basic socket.io emit example", () => {
  test("Communicate #1", (done) => {
    // socket.once("lobby", () => {
    done();
    // });
  });
  test("Should communicate", (done) => {
    const sentMessage = "suatu pesan";

    socket.on("lala", (message) => {
      expect(message).toBe(sentMessage);
      done();
    });
    socket.emit("start", sentMessage);
    // setTimeout(() => {}, 500);
    // expect(4).toBe(4);
    // done();
  });
});
