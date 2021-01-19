import Tile, { ITile } from "@/models/Tile";
import { Service } from "typedi";

@Service()
export class TileService {
  public async getAll(): Promise<ITile[]> {
    return await Tile.find({}).populate("problem");
  }

  public async getOne(id: string): Promise<ITile> {
    return await Tile.findById(id).populate("problem");
  }

  public async create(data: Partial<ITile>): Promise<ITile> {
    return (await new Tile(data).save()).populate("problem");
  }

  public async delete(id: string): Promise<null> {
    await Tile.findByIdAndDelete({ _id: id });
    return null;
  }

  public async update(id: string, data: Partial<ITile>): Promise<ITile> {
    return await Tile.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    }).populate("problem");
  }
}
