import Tile, { ITile } from "@/models/Tile";
import { Service } from "typedi";

@Service()
export class TileService {
  public async getAll() {
    return await Tile.find({});
  }

  public async getOne(id: string) {
    return await Tile.findById(id);
  }

  public async create(data: Partial<ITile>) {
    return await new Tile(data).save();
  }

  public async delete(id: string) {
    return await Tile.findByIdAndDelete({ _id: id });
  }

  public async update(id: string, data: Partial<ITile>) {
    return await Tile.findByIdAndUpdate({ _id: id }, data, { new: true });
  }
}
