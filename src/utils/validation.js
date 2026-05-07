/**
 * Validates a name (last name or first name).
 * Minimum 2 characters.
 * @param {string} value
 * @returns {{ valid: boolean, error: string }}
 */
export function validateName(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: "Ce champ est requis" };
  }
  if (value.trim().length < 2) {
    return { valid: false, error: "Minimum 2 caractères" };
  }
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
    return { valid: false, error: "Caractères invalides" };
  }
  return { valid: true, error: "" };
}

/**
 * Validates an email address.
 * @param {string} value
 * @returns {{ valid: boolean, error: string }}
 */
export function validateEmail(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: "L'email est requis" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return { valid: false, error: "Email invalide" };
  }
  return { valid: true, error: "" };
}

/**
 * Validates a birth date. The person must be at least 18 years old.
 * @param {string} value - ISO date string (YYYY-MM-DD)
 * @param {Date} [today=new Date()] - Reference date for age calculation (injectable for testing)
 * @returns {{ valid: boolean, error: string }}
 */
export function validateBirthDate(value, today = new Date()) {
  if (!value) {
    return { valid: false, error: "La date de naissance est requise" };
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { valid: false, error: "Date invalide" };
  }
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 18);
  if (date > minDate) {
    return { valid: false, error: "Vous devez avoir au moins 18 ans" };
  }
  return { valid: true, error: "" };
}

/**
 * Validates a French postal code (5 digits).
 * @param {string} value
 * @returns {{ valid: boolean, error: string }}
 */
export function validatePostalCode(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: "Le code postal est requis" };
  }
  if (!/^\d{5}$/.test(value.trim())) {
    return { valid: false, error: "Format invalide (5 chiffres requis)" };
  }
  return { valid: true, error: "" };
}

/**
 * Validates a city name.
 * @param {string} value
 * @returns {{ valid: boolean, error: string }}
 */
export function validateCity(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: "La ville est requise" };
  }
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
    return { valid: false, error: "Caractères invalides" };
  }
  return { valid: true, error: "" };
}

/**
 * Validates a complete registration form.
 * @param {{ lastName: string, firstName: string, email: string, birthDate: string, city: string, postalCode: string }} data
 * @param {Date} [today=new Date()]
 * @returns {{ valid: boolean, errors: { lastName: string, firstName: string, email: string, birthDate: string, city: string, postalCode: string } }}
 */
export function validateForm(data, today = new Date()) {
  const errors = {
    lastName: validateName(data.lastName).error,
    firstName: validateName(data.firstName).error,
    email: validateEmail(data.email).error,
    birthDate: validateBirthDate(data.birthDate, today).error,
    city: validateCity(data.city).error,
    postalCode: validatePostalCode(data.postalCode).error,
  };
  const valid = Object.values(errors).every((e) => e === "");
  return { valid, errors };
}
