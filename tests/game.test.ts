// import { env } from "@/env";
import { io as ioServer, server as httpServer, start } from "@/app";
import { env } from "@/env";
import { io, Socket } from "socket.io-client";
import { before, beforeEach, after, afterEach, it } from "mocha";
import { expect } from "chai";
import { Pawn } from "@/models/Game";

const sockets: Socket[] = [];

before(() => {
  return start();
});

after((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

describe("Lobby test", () => {
  // Initialize first player
  before((done) => {
    sockets[0] = io(`http://localhost:${env.port}/`);
    sockets[0].on("connect", () => {
      done();
    });
  });
  // Initialize second player
  before((done) => {
    sockets[1] = io(`http://localhost:${env.port}/`);
    sockets[1].on("connect", () => {
      done();
    });
  });

  // Simulate Player #1 join
  it("Player #1 join", (done) => {
    sockets[0].emit("LOBBY_addPlayer", "id1");
    sockets[0].on("LOBBY_playersInLobby", (pawns: Pawn[]) => {
      expect(pawns.length).to.be.equal(1);
      done();
    });
  });

  // Simulate Player #2 join
  it("Player #2 join", (done) => {
    sockets[1].emit("LOBBY_addPlayer", "id2");
    sockets[1].on("LOBBY_playersInLobby", (pawns: Pawn[]) => {
      expect(pawns.length).to.be.equal(2);
      done();
    });
  });
});
