module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(mp4|webm|ogg|mp3|wav|jpg|jpeg|png|gif|svg)$":
      "<rootDir>/__mocks__/fileMock.cjs",
  },

  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/components/ui/**",
    "!src/lib/**",
  ],
};
