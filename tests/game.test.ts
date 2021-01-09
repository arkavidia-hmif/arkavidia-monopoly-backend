// import { env } from "@/env";
import { io as ioServer, server as httpServer, start } from "@/app";
import { env } from "@/env";
import { io, Socket } from "socket.io-client";
import { before, beforeEach, after, afterEach, it } from "mocha";
import { expect } from "chai";

let socket: Socket;

before(() => {
  return start();
});

beforeEach((done) => {
  console.log(httpServer.address());
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

after((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

describe("Basic socket.io emit example", () => {
  // test("Communicate #1", (done) => {
  //   // socket.once("lobby", () => {
  //   done();
  //   // });
  // });
  it("Should communicate", (done) => {
    const sentMessage = "suatu pesan";

    socket.emit("start", sentMessage);
    socket.on("lala", (message) => {
      expect(message).to.be.equal(sentMessage);
      done();
    });
    // setTimeout(() => {}, 500);
    // expect(4).toBe(4);
    // done();
  });
});
