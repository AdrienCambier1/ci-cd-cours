module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/components/ui/**",
    "!src/lib/**",
  ],
};
