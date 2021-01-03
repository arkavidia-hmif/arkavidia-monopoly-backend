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
  data?: string;
}

export const TileSchema = new Schema<ITile>({
  type: { type: TileType, required: true },
  data: { type: String },
});

export default mongoose.model<ITile>("tile", TileSchema);
