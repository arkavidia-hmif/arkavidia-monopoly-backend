import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
  ),
});

export const env = {
  port: parseInt(process.env.PORT),
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  api: {
    url: process.env.API_URL,
  },
};
