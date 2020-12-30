import { Schema } from "mongoose";
import Tile from "./Tile";

export const PropertyTileSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  group: { type: String },
  imageUrl: { type: String },
});

export default Tile.discriminator("property", PropertyTileSchema);
