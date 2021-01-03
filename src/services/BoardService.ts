import Board, { IBoard } from "@/models/Board";
import { Service } from "typedi";

@Service()
export class BoardService {
  public async getAll() {
    return await Board.find({}).populate("tile");
  }

  public async getOne(id: string) {
    return await (await Board.findById(id)).populated("tile");
  }

  public async create(data: Partial<IBoard>) {
    return await new Board(data).save();
  }

  public async delete(id: string) {
    return await Board.findByIdAndDelete(id);
  }

  public async appendTile(id: string, tileId: string) {
    const board = await Board.findById(id);
    board.tiles.push(tileId);
    return await board.save();
  }
}
