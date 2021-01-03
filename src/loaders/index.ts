import { Express } from "express";
import { corsLoader } from "./corsLoader";
import { mongooseLoader } from "./mongooseLoader";
import { morganLoader } from "./morganLoader";
import { redocLoader } from "./redocLoader";

export const mainLoader = async (expressApp: Express): Promise<void> => {
  try {
    // Define the loaders here...
    corsLoader(expressApp);
    console.info("CORS initialized");

    await mongooseLoader();
    console.info("Mongoose connected to MongoDB");

    morganLoader(expressApp);
    console.info("Morgan logger initialized");

    redocLoader(expressApp);
    console.info("Redoc documentation initialized");
  } catch (err) {
    throw err;
  }
};
