/**
 * Validates a name (last name or first name).
 * Minimum 2 characters.
 * @param {string} value
 * @returns {string} Trimmed valid name.
 * @throws {Error} When the name is invalid.
 */
export function validateName(value) {
  if (!value || value.trim().length === 0) {
    throw new Error("Ce champ est requis");
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length < 2) {
    throw new Error("Minimum 2 caractères");
  }
  if (!/^[\p{L}\s'-]+$/u.test(trimmedValue)) {
    throw new Error("Caractères invalides");
  }

  return trimmedValue;
}

/**
 * Validates an email address.
 * @param {string} value
 * @returns {string} Trimmed valid email.
 * @throws {Error} When the email is invalid.
 */
export function validateEmail(value) {
  if (!value || value.trim().length === 0) {
    throw new Error("L'email est requis");
  }

  const trimmedValue = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    throw new Error("Email invalide");
  }

  return trimmedValue;
}

/**
 * Validates a birth date. The person must be at least 18 years old.
 * @param {string} value - ISO date string (YYYY-MM-DD)
 * @returns {string} Valid ISO date string.
 * @throws {Error} When the birth date is invalid.
 */
export function validateBirthDate(value) {
  if (!value) {
    throw new Error("La date de naissance est requise");
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error("Date invalide");
  }

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  if (date > minDate) {
    throw new Error("Vous devez avoir au moins 18 ans");
  }

  return value;
}

/**
 * Validates a French postal code (5 digits).
 * @param {string} value
 * @returns {string} Trimmed valid postal code.
 * @throws {Error} When the postal code is invalid.
 */
export function validatePostalCode(value) {
  if (!value || value.trim().length === 0) {
    throw new Error("Le code postal est requis");
  }

  const trimmedValue = value.trim();
  if (!/^\d{5}$/.test(trimmedValue)) {
    throw new Error("Format invalide (5 chiffres requis)");
  }

  return trimmedValue;
}

/**
 * Validates a city name.
 * @param {string} value
 * @returns {string} Trimmed valid city.
 * @throws {Error} When the city is invalid.
 */
export function validateCity(value) {
  if (!value || value.trim().length === 0) {
    throw new Error("La ville est requise");
  }

  const trimmedValue = value.trim();
  if (!/^[\p{L}\s'-]+$/u.test(trimmedValue)) {
    throw new Error("Caractères invalides");
  }

  return trimmedValue;
}

/**
 * Validates a complete registration form.
 * @param {{ lastName: string, firstName: string, email: string, birthDate: string, city: string, postalCode: string }} data
 * @returns {{ lastName: string, firstName: string, email: string, birthDate: string, city: string, postalCode: string }} Valid form data.
 * @throws {Error} When at least one field is invalid. The thrown error includes an errors object.
 */
export function validateForm(data) {
  const errors = {
    lastName: "",
    firstName: "",
    email: "",
    birthDate: "",
    city: "",
    postalCode: "",
  };
  const validatedData = {};

  try {
    validatedData.lastName = validateName(data.lastName);
  } catch (error) {
    errors.lastName = error.message;
  }

  try {
    validatedData.firstName = validateName(data.firstName);
  } catch (error) {
    errors.firstName = error.message;
  }

  try {
    validatedData.email = validateEmail(data.email);
  } catch (error) {
    errors.email = error.message;
  }

  try {
    validatedData.birthDate = validateBirthDate(data.birthDate);
  } catch (error) {
    errors.birthDate = error.message;
  }

  try {
    validatedData.city = validateCity(data.city);
  } catch (error) {
    errors.city = error.message;
  }

  try {
    validatedData.postalCode = validatePostalCode(data.postalCode);
  } catch (error) {
    errors.postalCode = error.message;
  }

  if (Object.values(errors).some((error) => error !== "")) {
    const error = new Error("Formulaire invalide");
    error.errors = errors;
    throw error;
  }

  return validatedData;
}
