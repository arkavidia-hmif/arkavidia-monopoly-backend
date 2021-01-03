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
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";

export class PlayerBase {
  @IsString()
  public name: string;

  @IsString()
  public color: string;
}

export class CreatePlayerBody extends PlayerBase {
  @IsString()
  public name: string;

  @IsString()
  public color: string;
}

export class UpdatePlayerBody extends PlayerBase {
  @IsString()
  public name: string;

  @IsString()
  public color: string;
}

export class PlayerResponse extends PlayerBase {
  @IsString()
  public _id?: string;

  @IsNumber()
  public __v?: number;
}

@JsonController("/player")
@OpenAPI({ security: [{ basicAuth: [] }] })
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get("/")
  @ResponseSchema(PlayerResponse, { isArray: true })
  @OpenAPI({
    description: "Get all players",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getAllPlayers(): Promise<PlayerResponse[]> {
    return await this.playerService.getAll();
  }

  @Get("/:id")
  @ResponseSchema(PlayerResponse)
  @OpenAPI({
    description: "Get player by ID",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getPlayerById(@Param("id") id: string): Promise<PlayerResponse> {
    return await this.playerService.getOne(id);
  }

  @Post("/")
  @ResponseSchema(PlayerResponse)
  @OpenAPI({
    description: "Create new player",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async createPlayer(
    @Body() data: CreatePlayerBody
  ): Promise<PlayerResponse> {
    return await this.playerService.create(data);
  }

  @Put("/:id")
  @ResponseSchema(PlayerResponse)
  @OpenAPI({
    description: "Update player by ID",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async updatePlayer(
    @Param("id") id: string,
    @Body() data: UpdatePlayerBody
  ): Promise<PlayerResponse> {
    return await this.playerService.update(id, data);
  }

  @Delete("/:id")
  @ResponseSchema(null)
  @OpenAPI({
    description: "Delete player by ID",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async deletePlayer(@Param("id") id: string) {
    await this.playerService.delete(id);
    return null;
  }
}
