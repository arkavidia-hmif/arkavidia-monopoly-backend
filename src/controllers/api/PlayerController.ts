import { IPlayer } from "@/models/Player";
import { PlayerService } from "@/services/PlayerService";
import { Body, Get, JsonController, Post } from "routing-controllers";

@JsonController("/player")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get("/")
  public async getAllPlayers() {
    const players = await this.playerService.getAll();
    return players;
  }

  @Post("/")
  public async createPlayer(@Body() data: IPlayer) {
    return await this.playerService.create(data);
  }
}
