import mongoose, { Document, Schema } from "mongoose";
import { IProblem } from "./Problem";

export enum TileType {
  START,
  JAIL,
  PARKING,
  PROPERTY,
  POWER_UP,
  NONE,
}

export interface ITile extends Document {
  type: TileType;
  problem?: string | IProblem;
  price?: number;
  multiplier?: number;
  group?: string | null;
}

export const TileSchema = new Schema<ITile>({
  type: { type: TileType, required: true },
  problem: { type: Schema.Types.ObjectId, ref: "problem" },
  price: { type: Number },
  multiplier: { type: Number },
  group: { type: String },
});

export default mongoose.model<ITile>("tile", TileSchema);
