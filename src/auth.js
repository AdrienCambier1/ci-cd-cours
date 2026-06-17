const authStorageKey = "ci-cd-cours-authenticated";

export function getIsAuthenticated() {
  return sessionStorage.getItem(authStorageKey) === "true";
}

export function setIsAuthenticated(isAuthenticated) {
  if (isAuthenticated) {
    sessionStorage.setItem(authStorageKey, "true");
    return;
  }

  sessionStorage.removeItem(authStorageKey);
}
