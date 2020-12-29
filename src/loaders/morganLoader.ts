import { Express } from "express";
import morgan from "morgan";

export const morganLoader = (app: Express) => {
  app.use(morgan("tiny"));
  return;
};
