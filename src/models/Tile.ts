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
  data?: string;
}

export const TileSchema = new Schema<ITile>({
  type: { type: TileType, required: true },
  problemId: { type: Schema.Types.ObjectId, ref: "problem" },
  data: { type: String },
});

export default mongoose.model<ITile>("tile", TileSchema);
