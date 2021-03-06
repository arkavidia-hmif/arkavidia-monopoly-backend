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
import { TileType } from "@/models/Tile";
import Container from "typedi";
import { GameService } from "@/services/GameService";
import * as http from "http";
import { GameConfig } from "@/config/GameConfig";

const playerCount = 3;
let server: http.Server;
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
      sockets[i].once(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
        expect(pawns.length).to.be.equal(i + 1);
        done();
      });
    });
  }

  // Simulate player starting game
  it("Starting game", (done) => {
    sockets[0].emit(LobbyEvent.START, "6006bc654b88490a8c7f27af");
    sockets[0].once(LobbyEvent.GAME_STARTED, (board: IBoard) => {
      expect(board).to.not.be.undefined;
      done();
    });
  });
});

describe("Game simulation #1", () => {
  describe("Simulate start turn and move", () => {
    it("should pass message", (done) => {
      sockets[0].emit(GameEvent.START_TURN);
      sockets[0].once(GameEvent.MOVE, (tilesMoved: number) => {
        sockets[0].emit(GameEvent.MOVE, tilesMoved);
        done();
      });
    });
  });

  // Accepts end turn
  describe("Simulate end turn", () => {
    it("should pass message", (done) => {
      sockets[0].emit(GameEvent.END_TURN);
      sockets[0].once(GameEvent.START_TURN, (turn: number) => {
        expect(turn).to.be.eq(1);
        done();
      });
    });
  });
});

describe("Game simulation #2", () => {
  describe("Simulate landing on property tile", () => {
    it("should pass message", (done) => {
      sockets[1].emit(GameEvent.PROPERTY_TILE);
      sockets[1].once(GameEvent.GIVE_PROBLEM, () => {
        Container.get(GameService).movePawnToTileType(TileType.PROPERTY);
        done();
      });
    });
  });

  let answer: number;
  let prevPoints: number;
  describe("Simulate problem giving mechanism", () => {
    it("should pass message, sent problem", (done) => {
      sockets[1].emit(GameEvent.GIVE_PROBLEM);
      sockets[1].once(GameEvent.PROBLEM, (body: IProblem) => {
        expect(body).to.not.be.undefined;
        answer = body.answer;
        prevPoints = Container.get(GameService).getCurrentPoints();
        console.log(prevPoints);
        done();
      });
    });
  });

  describe("Simulate correct answer", () => {
    it("should pass message", (done) => {
      sockets[1].emit(GameEvent.ANSWER_PROBLEM, answer);
      sockets[1].once(GameEvent.CORRECT_ANSWER, () => {
        done();
      });
    });
  });

  describe("Simulate ending turn", () => {
    it("should pass message, points add up", (done) => {
      sockets[1].emit(GameEvent.CORRECT_ANSWER);
      sockets[1].once(GameEvent.END_TURN, () => {
        const points = Container.get(GameService).getCurrentPoints();
        expect(points).to.be.eq(prevPoints + GameConfig.CORRECT_ANSWER_POINTS);
        done();
      });
    });
  });
  describe("Simulate ending turn", () => {
    it("should pass message", (done) => {
      sockets[1].emit(GameEvent.END_TURN);
      sockets[1].once(GameEvent.START_TURN, (turn: number) => {
        expect(turn).to.be.eq(2);
        done();
      });
    });
  });
});

// describe("Game simulation #3", () => {
//   describe("Simulate landing on ");
// });

// Teardown
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
