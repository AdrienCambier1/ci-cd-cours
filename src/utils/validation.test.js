import {
  validateName,
  validateEmail,
  validateBirthDate,
  validatePostalCode,
  validateCity,
  validateForm,
} from "./validation";

const TEST_DATE = new Date("2024-06-15");

describe("validateName", () => {
  it("should return error when empty", () => {
    expect(validateName("")).toEqual({
      valid: false,
      error: "Ce champ est requis",
    });
  });

  it("should return error when only spaces", () => {
    expect(validateName("   ")).toEqual({
      valid: false,
      error: "Ce champ est requis",
    });
  });

  it("should return error when too short", () => {
    expect(validateName("a")).toEqual({
      valid: false,
      error: "Minimum 2 caractères",
    });
  });

  it("should return error for invalid characters", () => {
    expect(validateName("Jean123")).toEqual({
      valid: false,
      error: "Caractères invalides",
    });
  });

  it("should return valid for a correct name", () => {
    expect(validateName("Jean")).toEqual({ valid: true, error: "" });
  });

  it("should return valid for a name with hyphen", () => {
    expect(validateName("Jean-Marc")).toEqual({ valid: true, error: "" });
  });

  it("should return valid for a name with apostrophe", () => {
    expect(validateName("d'Artagnan")).toEqual({ valid: true, error: "" });
  });

  it("should return valid for a name with accents", () => {
    expect(validateName("Élodie")).toEqual({ valid: true, error: "" });
  });
});

describe("validateEmail", () => {
  it("should return error when empty", () => {
    expect(validateEmail("")).toEqual({
      valid: false,
      error: "L'email est requis",
    });
  });

  it("should return error for missing @", () => {
    expect(validateEmail("invalidemail")).toEqual({
      valid: false,
      error: "Email invalide",
    });
  });

  it("should return error for missing domain", () => {
    expect(validateEmail("test@")).toEqual({
      valid: false,
      error: "Email invalide",
    });
  });

  it("should return valid for a correct email", () => {
    expect(validateEmail("test@example.com")).toEqual({
      valid: true,
      error: "",
    });
  });
});

describe("validateBirthDate", () => {
  it("should return error when empty", () => {
    expect(validateBirthDate("", TEST_DATE)).toEqual({
      valid: false,
      error: "La date de naissance est requise",
    });
  });

  it("should return error for an invalid date string", () => {
    expect(validateBirthDate("not-a-date", TEST_DATE)).toEqual({
      valid: false,
      error: "Date invalide",
    });
  });

  it("should return error when under 18", () => {
    expect(validateBirthDate("2010-01-01", TEST_DATE)).toEqual({
      valid: false,
      error: "Vous devez avoir au moins 18 ans",
    });
  });

  it("should return error when 1 day short of 18", () => {
    expect(validateBirthDate("2006-06-16", TEST_DATE)).toEqual({
      valid: false,
      error: "Vous devez avoir au moins 18 ans",
    });
  });

  it("should return valid when exactly 18", () => {
    expect(validateBirthDate("2006-06-15", TEST_DATE)).toEqual({
      valid: true,
      error: "",
    });
  });

  it("should return valid when over 18", () => {
    expect(validateBirthDate("1990-01-01", TEST_DATE)).toEqual({
      valid: true,
      error: "",
    });
  });

  it("should use current date by default", () => {
    expect(validateBirthDate("1990-01-01", TEST_DATE).valid).toBe(true);
  });
});

describe("validatePostalCode", () => {
  it("should return error when empty", () => {
    expect(validatePostalCode("")).toEqual({
      valid: false,
      error: "Le code postal est requis",
    });
  });

  it("should return error for letters", () => {
    expect(validatePostalCode("abcde")).toEqual({
      valid: false,
      error: "Format invalide (5 chiffres requis)",
    });
  });

  it("should return error for less than 5 digits", () => {
    expect(validatePostalCode("1234")).toEqual({
      valid: false,
      error: "Format invalide (5 chiffres requis)",
    });
  });

  it("should return error for more than 5 digits", () => {
    expect(validatePostalCode("123456")).toEqual({
      valid: false,
      error: "Format invalide (5 chiffres requis)",
    });
  });

  it("should return valid for a correct French postal code", () => {
    expect(validatePostalCode("75001")).toEqual({ valid: true, error: "" });
  });
});

describe("validateCity", () => {
  it("should return error when empty", () => {
    expect(validateCity("")).toEqual({
      valid: false,
      error: "La ville est requise",
    });
  });

  it("should return error for invalid characters", () => {
    expect(validateCity("Paris123")).toEqual({
      valid: false,
      error: "Caractères invalides",
    });
  });

  it("should return valid for a correct city", () => {
    expect(validateCity("Paris", TEST_DATE)).toEqual({
      valid: true,
      error: "",
    });
  });

  it("should return valid for a city with hyphen", () => {
    expect(validateCity("Aix-en-Provence", TEST_DATE)).toEqual({
      valid: true,
      error: "",
    });
  });
});

describe("validateForm", () => {
  const validData = {
    lastName: "Dupont",
    firstName: "Jean",
    email: "jean@example.com",
    birthDate: "1990-01-01",
    city: "Paris",
    postalCode: "75001",
  };

  it("should return valid when all fields are correct", () => {
    const result = validateForm(validData, TEST_DATE);
    expect(result.valid).toBe(true);
    expect(Object.values(result.errors).every((e) => e === "")).toBe(true);
  });

  it("should return invalid when one field is incorrect", () => {
    const result = validateForm({ ...validData, email: "invalid" }, TEST_DATE);
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("Email invalide");
  });

  it("should return all errors when all fields are empty", () => {
    const result = validateForm(
      {
        lastName: "",
        firstName: "",
        email: "",
        birthDate: "",
        city: "",
        postalCode: "",
      },
      TEST_DATE,
    );
    expect(result.valid).toBe(false);
    expect(Object.values(result.errors).every((e) => e !== "")).toBe(true);
  });

  it("should use current date by default", () => {
    expect(validateForm(validData, TEST_DATE).valid).toBe(true);
  });
});
