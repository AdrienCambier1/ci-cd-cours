module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
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
