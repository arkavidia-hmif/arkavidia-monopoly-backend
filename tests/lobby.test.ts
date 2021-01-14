// import { env } from "@/env";
import { io as ioServer, server as httpServer, start } from "@/app";
import { env } from "@/env";
import { io, Socket } from "socket.io-client";
import { before, after, it } from "mocha";
import { expect } from "chai";
import { Pawn } from "@/models/Game";
import { LobbyEvent } from "@/events/LobbyEvent";

const sockets: Socket[] = [];

before(() => {
  return start();
});

after((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

describe("Player join", () => {
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
    sockets[0].emit(LobbyEvent.ADD_PLAYER, "id1");
    sockets[0].on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
      expect(pawns.length).to.be.equal(1);
      done();
    });
  });

  // Simulate Player #2 join
  it("Player #2 join", (done) => {
    sockets[1].emit(LobbyEvent.ADD_PLAYER, "id2");
    sockets[1].on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
      expect(pawns.length).to.be.equal(2);
      done();
    });
  });

  // Terminate first player connection
  after((done) => {
    if (sockets[0].connected) {
      sockets[0].disconnect();
    }
    done();
  });

  // Terminate second player connection
  after((done) => {
    if (sockets[1].connected) {
      sockets[1].disconnect();
    }
    done();
  });
});

describe("Start Game", () => {
  // Initialize first player
  before((done) => {
    sockets[0] = io(`http://localhost:${env.port}/`);
    sockets[0].on("connect", () => {
      done();
    });
  });

  // Simulate player joining lobby
  it("Player join", (done) => {
    sockets[0].emit(LobbyEvent.ADD_PLAYER, "id1");
    sockets[0].on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
      expect(pawns.length).to.be.equal(1);
      done();
    });
  });

  // Simulate player starting game
  it("Starting game", (done) => {
    sockets[0].emit(LobbyEvent.START);
    sockets[0].on(LobbyEvent.GAME_STARTED, () => {
      done();
    });
  });
});
