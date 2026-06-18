const authStorageKey = "ci-cd-cours-authenticated";

/**
 * Reads the current authentication flag from session storage.
 *
 * @returns {boolean} True when the user is marked as authenticated.
 */
export function getIsAuthenticated() {
  return sessionStorage.getItem(authStorageKey) === "true";
}

/**
 * Persists or clears the current authentication flag in session storage.
 *
 * @param {boolean} isAuthenticated - Whether the user should be authenticated.
 * @returns {void}
 */
export function setIsAuthenticated(isAuthenticated) {
  if (isAuthenticated) {
    sessionStorage.setItem(authStorageKey, "true");
    return;
  }

  sessionStorage.removeItem(authStorageKey);
}
