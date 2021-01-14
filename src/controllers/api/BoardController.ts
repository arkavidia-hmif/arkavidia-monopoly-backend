import { ITile } from "@/models/Tile";
import { BoardService } from "@/services/BoardService";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { TileResponse } from "./TileController";

export class BoardBase {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TileResponse)
  tiles: string[] | ITile[];
}

export class AddTileBody {
  @IsString()
  tileId: string;
}

export class AddTilesBody {
  @IsArray()
  tileIds: string[];
}

export class BoardResponse extends BoardBase {
  @IsNumber()
  _id?: number;

  @IsNumber()
  __v?: number;
}

@JsonController("/board")
@OpenAPI({ security: [{ basicAuth: [] }] })
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get("/")
  @ResponseSchema(BoardResponse, { isArray: true })
  @OpenAPI({
    description: "Get all boards.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getBoard(): Promise<BoardResponse[]> {
    return await this.boardService.getAll();
  }

  @Get("/:id")
  @ResponseSchema(BoardResponse)
  @OpenAPI({
    description: "Get board by ID.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getBoardById(@Param("id") id: string): Promise<BoardResponse> {
    return await this.boardService.getOne(id);
  }

  @Post("/")
  @ResponseSchema(BoardResponse)
  @OpenAPI({
    description: "Create empty board.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async createBoard(): Promise<BoardResponse> {
    return await this.boardService.create();
  }

  @Put("/addTile/:id")
  @ResponseSchema(BoardResponse)
  @OpenAPI({
    description: "Add tile.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async addTile(
    @Param("id") id: string,
    @Body() data: AddTileBody
  ): Promise<BoardResponse> {
    return await this.boardService.appendTile(id, data.tileId);
  }

  @Put("/addTiles/:id")
  @ResponseSchema(BoardResponse)
  @OpenAPI({
    description: "Add tile.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async addTiles(
    @Param("id") id: string,
    @Body() data: AddTilesBody
  ): Promise<BoardResponse> {
    return await this.boardService.appendTiles(id, data.tileIds);
  }

  @Delete("/:id")
  @ResponseSchema(null)
  @OpenAPI({
    description: "Delete board by ID.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async deleteBoard(@Param("id") id: string): Promise<null> {
    return await this.boardService.delete(id);
  }
}
