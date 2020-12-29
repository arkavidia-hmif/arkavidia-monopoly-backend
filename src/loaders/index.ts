import { Express } from "express";
import { corsLoader } from "./corsLoader";
import { mongooseLoader } from "./mongooseLoader";
import { morganLoader } from "./morganLoader";

export const mainLoader = async (expressApp: Express) => {
  try {
    // Define the loaders here...
    corsLoader(expressApp);
    console.info("CORS initialized");

    await mongooseLoader();
    console.info("Mongoose connected to MongoDB");

    morganLoader(expressApp);
    console.info("Morgan logger initialized");
  } catch (err) {
    throw err;
  }
};
