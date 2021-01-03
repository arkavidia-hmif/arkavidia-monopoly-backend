import Player, { IPlayer } from "@/models/Player";
import { Service } from "typedi";

@Service()
export class PlayerService {
  public async getAll(): Promise<IPlayer[]> {
    return await Player.find({});
  }

  public async getOne(id: string): Promise<IPlayer> {
    return await Player.findById(id);
  }

  public async create(data: Partial<IPlayer>): Promise<IPlayer> {
    return await new Player(data).save();
  }

  public async delete(id: string): Promise<null> {
    await Player.findByIdAndDelete(id);
    return null;
  }

  public async update(id: string, data: Partial<IPlayer>): Promise<IPlayer> {
    return await Player.findByIdAndUpdate(id, data, { new: true });
  }
}
