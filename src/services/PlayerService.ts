import Player, { IPlayer } from "@/models/Player";
import { Service } from "typedi";

@Service()
export class PlayerService {
  public async getAll() {
    return await Player.find({});
  }

  public async getOne(id: string) {
    return await Player.findOne({ _id: id });
  }

  public async create(data: Partial<IPlayer>) {
    return await new Player(data).save();
  }

  public async delete(id: string) {
    return await Player.deleteOne({ _id: id });
  }

  public async update(id: string, data: Partial<IPlayer>) {
    return await Player.findOneAndUpdate({ _id: id }, data, { new: true });
  }
}
