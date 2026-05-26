import {
  validateName,
  validateEmail,
  validateBirthDate,
  validatePostalCode,
  validateCity,
  validateForm,
} from "./validation";

describe("validateName", () => {
  it("should throw when empty", () => {
    expect(() => validateName("")).toThrow("Ce champ est requis");
  });

  it("should throw when only spaces", () => {
    expect(() => validateName("   ")).toThrow("Ce champ est requis");
  });

  it("should throw when too short", () => {
    expect(() => validateName("a")).toThrow("Minimum 2 caractères");
  });

  it("should throw for invalid characters", () => {
    expect(() => validateName("Jean123")).toThrow("Caractères invalides");
  });

  it("should return the trimmed value for a correct name", () => {
    expect(validateName(" Jean ")).toBe("Jean");
  });

  it("should return a valid name with hyphen", () => {
    expect(validateName("Jean-Marc")).toBe("Jean-Marc");
  });

  it("should return a valid name with apostrophe", () => {
    expect(validateName("d'Artagnan")).toBe("d'Artagnan");
  });

  it("should return a valid name with accents", () => {
    expect(validateName("\u00c9lodie")).toBe("\u00c9lodie");
  });
});

describe("validateEmail", () => {
  it("should throw when empty", () => {
    expect(() => validateEmail("")).toThrow("L'email est requis");
  });

  it("should throw for missing @", () => {
    expect(() => validateEmail("invalidemail")).toThrow("Email invalide");
  });

  it("should throw for missing domain", () => {
    expect(() => validateEmail("test@")).toThrow("Email invalide");
  });

  it("should return the trimmed value for a correct email", () => {
    expect(validateEmail(" test@example.com ")).toBe("test@example.com");
  });
});

describe("validateBirthDate", () => {
  it("should throw when empty", () => {
    expect(() => validateBirthDate("")).toThrow(
      "La date de naissance est requise",
    );
  });

  it("should throw for an invalid date string", () => {
    expect(() => validateBirthDate("not-a-date")).toThrow("Date invalide");
  });

  it("should throw when under 18", () => {
    expect(() => validateBirthDate("2010-01-01")).toThrow(
      "Vous devez avoir au moins 18 ans",
    );
  });

  it("should return the value when over 18", () => {
    expect(validateBirthDate("1990-01-01")).toBe("1990-01-01");
  });
});

describe("validatePostalCode", () => {
  it("should throw when empty", () => {
    expect(() => validatePostalCode("")).toThrow("Le code postal est requis");
  });

  it("should throw for letters", () => {
    expect(() => validatePostalCode("abcde")).toThrow(
      "Format invalide (5 chiffres requis)",
    );
  });

  it("should throw for less than 5 digits", () => {
    expect(() => validatePostalCode("1234")).toThrow(
      "Format invalide (5 chiffres requis)",
    );
  });

  it("should throw for more than 5 digits", () => {
    expect(() => validatePostalCode("123456")).toThrow(
      "Format invalide (5 chiffres requis)",
    );
  });

  it("should return the trimmed value for a correct French postal code", () => {
    expect(validatePostalCode(" 75001 ")).toBe("75001");
  });
});

describe("validateCity", () => {
  it("should throw when empty", () => {
    expect(() => validateCity("")).toThrow("La ville est requise");
  });

  it("should throw for invalid characters", () => {
    expect(() => validateCity("Paris123")).toThrow("Caractères invalides");
  });

  it("should return the trimmed value for a correct city", () => {
    expect(validateCity(" Paris ")).toBe("Paris");
  });

  it("should return a valid city with hyphen", () => {
    expect(validateCity("Aix-en-Provence")).toBe("Aix-en-Provence");
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

  it("should return the data when all fields are correct", () => {
    expect(validateForm(validData)).toEqual(validData);
  });

  it("should throw when one field is incorrect", () => {
    expect(() => validateForm({ ...validData, email: "invalid" })).toThrow(
      "Formulaire invalide",
    );
  });

  it("should throw when all fields are empty", () => {
    expect(() =>
      validateForm({
        lastName: "",
        firstName: "",
        email: "",
        birthDate: "",
        city: "",
        postalCode: "",
      }),
    ).toThrow("Formulaire invalide");
  });
});
