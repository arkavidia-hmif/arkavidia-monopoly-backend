// import { env } from "@/env";
import { io as ioServer, start } from "@/app";
import { env } from "@/env";
import { io, Socket } from "socket.io-client";
import { before, after, it } from "mocha";
import { expect } from "chai";
import { Pawn } from "@/models/Game";
import { LobbyEvent } from "@/events/LobbyEvent";
import mongoose from "mongoose";

let server;
const sockets: Socket[] = [];

before(async () => {
  server = await start();
  return;
});

after((done) => {
  ioServer.close();
  server.close();
  mongoose.disconnect();
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

// describe("Start Game", () => {
//   // Initialize first player
//   before((done) => {
//     sockets[0] = io(`http://localhost:${env.port}/`);
//     sockets[0].on("connect", () => {
//       done();
//     });
//   });

//   // Simulate player joining lobby
//   it("Player join", (done) => {
//     sockets[0].emit(LobbyEvent.ADD_PLAYER, "id1");
//     sockets[0].on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
//       expect(pawns.length).to.be.equal(1);
//       done();
//     });
//   });

//   // Simulate player starting game
//   it("Starting game", (done) => {
//     sockets[0].emit(LobbyEvent.START, "5ffc9dfa46b32f44349d73da");
//     sockets[0].on(LobbyEvent.GAME_STARTED, (board: IBoard) => {
//       expect(board).to.not.be.undefined;
//       done();
//     });
//   });
// });
