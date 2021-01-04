import Board, { IBoard } from "@/models/Board";
import { Service } from "typedi";

@Service()
export class BoardService {
  public async getAll(): Promise<IBoard[]> {
    return await Board.find({}).populate("tile");
  }

  public async getOne(id: string): Promise<IBoard> {
    return await (await Board.findById(id)).populated("tile");
  }

  public async create(data: Partial<IBoard>): Promise<IBoard> {
    return await new Board(data).save();
  }

  public async delete(id: string): Promise<null> {
    await Board.findByIdAndDelete(id);
    return null;
  }

  public async appendTile(id: string, tileId: string): Promise<IBoard> {
    const board = await Board.findById(id);
    board.tiles.push(tileId);
    return await board.save();
  }

  public async appendTiles(id: string, tileIds: string[]): Promise<IBoard> {
    const board = await Board.findById(id);
    board.tiles = board.tiles.concat(tileIds);
    return await board.save();
  }
}
