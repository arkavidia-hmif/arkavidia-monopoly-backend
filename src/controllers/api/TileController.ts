import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { TileService } from "@/services/TileService";
import { IsEnum, IsJSON, IsNumber, IsString } from "class-validator";
import { TileType } from "@/models/Tile";

export class TileBase {
  @IsEnum(TileType)
  type?: TileType;

  @IsString()
  problemId?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  multiplier?: number;
}

export class CreateTileBody extends TileBase {
  @IsEnum(TileType)
  type: TileType;

  @IsString()
  problemId?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  multiplier?: number;
}

export class UpdateTileBody extends TileBase {
  @IsEnum(TileType)
  type?: TileType;

  @IsString()
  problemId?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  multiplier?: number;
}

export class TileResponse extends TileBase {
  @IsString()
  public _id?: string;

  @IsNumber()
  public __v?: number;
}

@JsonController("/tile")
export class TileController {
  constructor(private tileService: TileService) {}

  @Get("/")
  public async getAllTiles(): Promise<TileResponse[]> {
    return await this.tileService.getAll();
  }

  @Get("/:id")
  public async getTileById(@Param("id") id: string): Promise<TileResponse> {
    return await this.tileService.getOne(id);
  }

  @Post("/")
  public async createTile(@Body() data: CreateTileBody): Promise<TileResponse> {
    return await this.tileService.create(data);
  }

  @Put("/:id")
  public async updateTile(
    @Param("id") id: string,
    @Body() data: UpdateTileBody
  ): Promise<TileResponse> {
    return await this.tileService.update(id, data);
  }

  @Delete("/:id")
  public async deleteTile(@Param("id") id: string): Promise<null> {
    return await this.tileService.delete(id);
  }
}