import mongoose, { Document, Schema } from "mongoose";

export interface ITile extends Document {}

export const TileSchema = new Schema({}, { discriminatorKey: "kind" });

export default mongoose.model<ITile>("tile", TileSchema);
