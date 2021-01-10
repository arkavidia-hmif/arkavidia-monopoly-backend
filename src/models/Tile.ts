import mongoose, { Document, Schema } from "mongoose";

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
  problemId?: string;
  price?: number;
  multiplier?: number;
}

export const TileSchema = new Schema<ITile>({
  type: { type: TileType, required: true },
  problemId: { type: Schema.Types.ObjectId, ref: "problem" },
  price: { type: Number },
  multiplier: { type: Number },
});

export default mongoose.model<ITile>("tile", TileSchema);
