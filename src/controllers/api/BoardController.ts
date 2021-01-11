import { ITile } from "@/models/Tile";
import { BoardService } from "@/services/BoardService";
import { IsNumber, IsObject } from "class-validator";
import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";

export class BoardBase {
  // @IsObject()
  tiles: string[] | ITile[];
}

export class AddTileBody {
  id: string;
  tileId: string;
}

export class BoardResponse extends BoardBase {
  // @IsNumber()
  _id?: number;

  // @IsNumber()
  __v?: number;
}

@JsonController("/board")
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get("/")
  public async getBoard(): Promise<BoardResponse[]> {
    return await this.boardService.getAll();
  }

  @Get("/:id")
  public async getBoardById(@Param("id") id: string): Promise<BoardResponse> {
    return await this.boardService.getOne(id);
  }

  @Post("/")
  public async createBoard(): Promise<BoardResponse> {
    return await this.boardService.create();
  }

  @Put("/addTile")
  public async addTile(@Body() data: AddTileBody): Promise<BoardResponse> {
    return await this.boardService.appendTile(data.id, data.tileId);
  }
}
