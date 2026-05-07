/**
 * Calculates the age of a person based on their birth date.
 *
 * @param {object} p - An object representing a person, implementing a birth Date parameter.
 * @returns {number} The age in years of p.
 **/
export function calculateAge(p) {
  if (p === undefined || p === null) {
    throw new Error("missing param p");
  }
  if (typeof p !== "object") {
    throw new Error("p must be an object");
  }
  if (p.birth === undefined) {
    throw new Error("missing field birth");
  }
  if (!(p.birth instanceof Date)) {
    throw new Error("birth must be a Date");
  }
  if (isNaN(p.birth.getTime())) {
    throw new Error("birth is an invalid date");
  }

  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;
}
