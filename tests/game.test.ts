import app from "@/app";
import { env } from "@/env";
import { io, Socket } from "socket.io-client";

let socket: Socket;
beforeAll((done) => {
  app();
  done();
});

beforeEach((done) => {
  socket = io(`${env.api.url}/game`);
  done();
});

test("should blabla", async (done) => {
  socket.emit("start");
  done();
});
