import * as mongoose from "mongoose";
import Player, { IPlayer } from "@/models/Player";
import { Service } from "typedi";

@Service()
export class PlayerService {
  public async getAll() {
    const players = await Player.find({}, "id name color");
    return players;
  }

  public async create(data: IPlayer) {
    return await new Player(data).save();
  }
}
