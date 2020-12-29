import { Express } from "express";
import cors from "cors";

export const corsLoader = (app: Express) => {
  app.use(cors());
  return;
};
