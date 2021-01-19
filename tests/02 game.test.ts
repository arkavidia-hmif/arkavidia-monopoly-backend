import { io, Socket } from "socket.io-client";
import { before, after, it } from "mocha";
import { expect } from "chai";

import { io as ioServer, start } from "@/app";
import { env } from "@/env";
import { Pawn } from "@/models/Game";
import { LobbyEvent } from "@/events/LobbyEvent";
import mongoose from "mongoose";
import { IBoard } from "@/models/Board";
import { GameEvent } from "@/events/GameEvent";
import { IProblem } from "@/models/Problem";

let server;
const playerCount = 3;
const sockets: Socket[] = [];

before(async () => {
  server = await start();
  return;
});

describe("Lobby simulation", () => {
  // Initialize players
  for (let i = 0; i < playerCount; i++) {
    before((done) => {
      sockets[i] = io(`http://localhost:${env.port}/`);
      sockets[i].on("connect", () => {
        done();
      });
    });

    it(`Player #${i + 1} join`, (done) => {
      sockets[i].emit(LobbyEvent.ADD_PLAYER, `id${i + 1}`);
      sockets[i].on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
        expect(pawns.length).to.be.equal(i + 1);
        done();
      });
    });
  }

  // Simulate player starting game
  it("Starting game", (done) => {
    sockets[0].emit(LobbyEvent.START, "6006bc654b88490a8c7f27af");
    sockets[0].on(LobbyEvent.GAME_STARTED, (board: IBoard) => {
      expect(board).to.not.be.undefined;
      done();
    });
  });
});

describe("Game simulation", () => {
  it("simulate movement and end turn", (done) => {
    // Accepts start turn
    sockets[0].emit(GameEvent.START_TURN);

    // Accepts move
    sockets[0].on(GameEvent.MOVE, (tilesMoved: number) => {
      sockets[0].emit(GameEvent.MOVE, tilesMoved);
      sockets[0].emit(GameEvent.END_TURN);
    });

    // Accepts end turn
    sockets[0].on(GameEvent.START_TURN, (turn: number) => {
      expect(turn).to.be.eq(1);
      done();
    });
  });

  it("simulate landing on property tile", (done) => {
    sockets[1].emit(GameEvent.START_TURN);
    sockets[1].on(GameEvent.PROPERTY_TILE, () => {
      sockets[1].emit(GameEvent.PROPERTY_TILE);
    });

    sockets[1].on(GameEvent.GIVE_PROBLEM, () => {
      sockets[1].emit(GameEvent.GIVE_PROBLEM);
    });

    sockets[1].on(GameEvent.PROBLEM, (body: IProblem) => {
      expect(body).to.not.be.undefined;
      const answer = body.answer;
      sockets[1].emit(GameEvent.ANSWER_PROBLEM, answer);
    });

    sockets[1].on(GameEvent.CORRECT_ANSWER, () => {
      sockets[1].emit(GameEvent.CORRECT_ANSWER);
    });

    sockets[1].on(GameEvent.START_TURN, (turn: number) => {
      expect(turn).to.be.eq(2);
      done();
    });
  });
});

// setTimeout(() => {
//   describe("Land on property tile", () => {

//   });
// }, 500);

for (let i = 0; i < playerCount; i++) {
  after((done) => {
    if (sockets[i].connected) {
      sockets[i].disconnect();
    }
    done();
  });
}

after((done) => {
  ioServer.close();
  server.close();
  mongoose.disconnect();
  done();
});
