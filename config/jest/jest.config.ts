/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";
import path from "path";

const createJestConfig = nextJest({
  dir: path.resolve(__dirname, "../../"),
});

const config: Config = {
  rootDir: path.resolve(__dirname, "../../"),
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/config/jest/jest.setup.ts"],
  testEnvironment: "jsdom",
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};

export default createJestConfig(config);
