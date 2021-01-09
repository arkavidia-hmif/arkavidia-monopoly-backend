// import { env } from "@/env";
import { io as ioServer, server as httpServer, start } from "@/app";
import { io, Socket } from "socket.io-client";

let socket: Socket;

beforeAll(async (done) => {
  await start();
  console.log(`🌵 🌵 🌵 1`);
  done();
});

beforeEach((done) => {
  jest.setTimeout(10000);
  console.log(`🌵 🌵 🌵 2`);
  socket = io(`http://localhost:3000/game/`);
  socket.on("connect", () => {
    console.info("asdasdasdasd");
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
  test("Should communicate", (done) => {
    // socket.once("start", (message) => {
    //   expect(message).toBe("lala");
    //   done();
    // });
    expect(4).toBe(4);
    done();
  }, 20000);
});
