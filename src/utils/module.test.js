import { calculateAge } from "./module";

describe("calculateAge Unit Test Suites", () => {
  it("should return the age of a person", () => {
    const loise = { birth: new Date("1990-01-01") };
    const expected = Math.abs(
      new Date(Date.now() - loise.birth.getTime()).getUTCFullYear() - 1970,
    );
    expect(calculateAge(loise)).toEqual(expected);
  });

  it("should throw when no argument is sent", () => {
    expect(() => calculateAge()).toThrow("missing param p");
  });

  it("should throw when p is not an object", () => {
    expect(() => calculateAge("hello")).toThrow("p");
    expect(() => calculateAge(42)).toThrow("p");
  });

  it("should throw when the birth field is missing", () => {
    expect(() => calculateAge({})).toThrow("missing field birth");
  });

  it("should throw when birth is not a Date", () => {
    expect(() => calculateAge({ birth: "1990-01-01" })).toThrow(
      "birth must be a Date",
    );
  });

  it("should throw when birth is an invalid date", () => {
    expect(() => calculateAge({ birth: new Date("not-a-date") })).toThrow(
      "birth is an invalid date",
    );
  });
});
