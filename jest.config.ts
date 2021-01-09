import { pathsToModuleNameMapper } from "ts-jest/utils";
import { compilerOptions } from "./tsconfig.json";
import type { Config } from "@jest/types";

const jestConfig: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  moduleDirectories: [".", "src", "node_modules"],
};

export default jestConfig;
