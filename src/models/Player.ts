import mongoose, { Document, Schema } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  color: string;
}

const PlayerSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

export default mongoose.model<IPlayer>("player", PlayerSchema);
