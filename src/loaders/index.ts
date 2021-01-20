import { Express } from "express";
import { mongooseLoader } from "./mongooseLoader";
import { morganLoader } from "./morganLoader";
import { redocLoader } from "./redocLoader";

export const mainLoader = async (expressApp: Express): Promise<void> => {
  try {
    await mongooseLoader();
    console.info("🌵 Mongoose connected to MongoDB");

    morganLoader(expressApp);
    console.info("🌵 Morgan logger initialized");

    redocLoader(expressApp);
    console.info("🌵 Redoc documentation initialized");
  } catch (err) {
    throw err;
  }
};
