import { env } from "@/env";
import { connect } from "mongoose";

export const mongooseLoader = async (): Promise<void> => {
  try {
    await connect(`mongodb://${env.db.host}/${env.db.name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
};
