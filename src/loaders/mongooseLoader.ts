import { env } from "@/env";
import { connect } from "mongoose";

export const mongooseLoader = async (): Promise<void> => {
  await connect(
    `mongodb://${env.db.user}:${env.db.pass}@${env.db.host}/${env.db.name}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};
