import mongoose, { Document, Schema } from "mongoose";

export interface IProblem extends Document {
  statement: string;
  answer: number;
}

const ProblemSchema = new Schema<IProblem>({
  statement: { type: String, required: true },
  answer: { type: Number, required: true },
});

export default mongoose.model<IProblem>("problem", ProblemSchema);
