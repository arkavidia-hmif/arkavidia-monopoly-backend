import { IPlayer } from "@/models/Player";
import { PlayerService } from "@/services/PlayerService";
import { IsNumber, IsString } from "class-validator";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";

class PlayerBase {
  @IsString()
  public name: string;

  @IsString()
  public color: string;
}

class CreatePlayerBody extends PlayerBase {}

class UpdatePlayerBody extends PlayerBase {}

class PlayerResponse extends PlayerBase {
  @IsString()
  public _id?: string;

  @IsNumber()
  public __v?: number;
}

@JsonController("/player")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get("/")
  public async getAllPlayers(): Promise<PlayerResponse[]> {
    const players = await this.playerService.getAll();
    return players;
  }

  @Get("/:id")
  public async getPlayerById(@Param("id") id: string): Promise<PlayerResponse> {
    return await this.playerService.getOne(id);
  }

  @Post("/")
  public async createPlayer(
    @Body() data: CreatePlayerBody
  ): Promise<PlayerResponse> {
    return await this.playerService.create(data);
  }

  @Put("/:id")
  public async updatePlayer(
    @Param("id") id: string,
    @Body() data: UpdatePlayerBody
  ): Promise<PlayerResponse> {
    return await this.playerService.update(id, data);
  }

  @Delete("/:id")
  public async deletePlayer(@Param("id") id: string) {
    return await this.playerService.delete(id);
  }
}
