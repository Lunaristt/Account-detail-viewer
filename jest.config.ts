import type { Config } from "jest";

const config: Config = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: { jsx: "react-jsx" },
        }],
    },
};

export default config;