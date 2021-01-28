process.env.NODE_ENV = "test";

import { env } from "@/env";
import mongoose from "mongoose";

export const preseed = async (): Promise<void> => {
  await mongoose.connect(`mongodb://${env.db.host}/${env.db.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mongoose.connection.db.dropDatabase();
  // mongoose.connection.db.dropDatabase(async () => {
  //   await mongoose.connection.close();
  // });
};
