import Board, { IBoard } from "@/models/Board";
import Problem from "@/models/Problem";
import { ITile } from "@/models/Tile";
import { Service } from "typedi";

@Service()
export class BoardService {
  public async getAll(): Promise<IBoard[]> {
    const boards = await Board.find({}).populate({
      path: "tiles",
      populate: {
        path: "problem",
        model: Problem,
      },
    });
    return boards;
  }

  public async getOne(id: string): Promise<IBoard> {
    return await Board.findById(id).populate({
      path: "tiles",
      populate: {
        path: "problem",
        model: Problem,
      },
    });
  }

  public async create(): Promise<IBoard> {
    return await new Board({ tiles: [] } as {
      tiles: string[] | ITile[];
    }).save();
  }

  public async delete(id: string): Promise<null> {
    await Board.findByIdAndDelete(id);
    return null;
  }

  public async appendTile(id: string, tileId: string): Promise<IBoard> {
    const board = await Board.findById(id);
    (board.tiles as string[]).push(tileId);
    await board.save();
    return await this.getOne(board.id);
  }

  public async appendTiles(id: string, tileIds: string[]): Promise<IBoard> {
    const board = await Board.findById(id);
    board.tiles = (board.tiles as string[]).concat(tileIds);
    await board.save();
    return await this.getOne(board.id);
  }
}
