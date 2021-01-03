import mongoose, { Document, Schema } from "mongoose";
import { ITile } from "./Tile";

export interface IBoard extends Document {
  tile: ITile;
}

export const BoardSchema = new Schema({
  tiles: [{ type: Schema.Types.ObjectId, ref: "tile" }],
});

export default mongoose.model<IBoard>("board", BoardSchema);
