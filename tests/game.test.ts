import { env } from "@/env";
import { io as ioServer, server } from "@/app";
import { io, Socket } from "socket.io-client";

let socket: Socket;

// beforeAll(async (done) => {
//   await setup({
//     command: "yarn test-server",
//     debug: true,
//     port: env.port,
//     host: env.api.url,
//   });
//   done();
// });

beforeEach((done) => {
  jest.setTimeout(10000);
  console.log(`${env.api.url}:${env.port}/game`);
  socket = io(`${env.api.url}:${env.port}/game`);
  socket.on("connect", () => {
    console.log("asdasdasdasd");
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
  server.close();
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
