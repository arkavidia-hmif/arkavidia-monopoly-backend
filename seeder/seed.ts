process.env.NODE_ENV = "test";

import { env } from "@/env";
import mongoose from "mongoose";
import { TileType } from "@/models/Tile";
import { BoardService } from "@/services/BoardService";
import { TileService } from "@/services/TileService";
import Container from "typedi";

export const seed = async (): Promise<void> => {
  // await mongoose.connect(`mongodb://${env.db.host}/${env.db.name}`, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  const board = await Container.get(BoardService).create();

  const tile1 = await Container.get(TileService).create({
    type: TileType.START,
  });
  const tile2 = await Container.get(TileService).create({
    type: TileType.JAIL,
  });
  const tile3 = await Container.get(TileService).create({
    type: TileType.POWER_UP,
  });
  const tile4 = await Container.get(TileService).create({
    type: TileType.PROPERTY,
    price: 50,
    multiplier: 1.2,
    group: "red",
  });

  await Container.get(BoardService).appendTiles(board._id, [
    tile1._id,
    tile2._id,
    tile3._id,
    tile4._id,
  ]);

  await mongoose.connection.close();
};
