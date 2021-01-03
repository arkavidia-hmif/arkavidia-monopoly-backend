import mongoose, { Document, Schema } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  color: string;
  type: "player" | "spectator";
}

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  color: { type: String, required: true },
  type: { type: String, enum: ["player", "spectator"] },
});

export default mongoose.model<IPlayer>("player", PlayerSchema);
