import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
  ),
});

export const env = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
  },
};
