import { Express } from "express";
import cors from "cors";

export const corsLoader = (app: Express): void => {
  app.use(cors({ origin: "http://localhost:3000" }));
  return;
};
