const authStorageKey = "ci-cd-cours-authenticated";

const user = {
  id: 1,
  last_name: "Dupont",
  first_name: "Jean",
  email: "jean.dupont@example.com",
  birthdate: "2000-01-15",
  city: "Paris",
  postal_code: "75001",
};

function visitAuthenticatedDashboard() {
  cy.intercept("GET", "**/users", {
    statusCode: 200,
    body: { users: [user] },
  }).as("getUsers");

  cy.visit("/dashboard", {
    onBeforeLoad(win) {
      win.sessionStorage.setItem(authStorageKey, "true");
    },
  });

  cy.wait("@getUsers");
}

describe("app navigation", () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
  });

  it("redirects unauthenticated users to the login page", () => {
    cy.visit("/dashboard");

    cy.contains("button", "Se connecter").should("be.disabled");
  });

  it("renders dashboard users and opens row action dialogs", () => {
    visitAuthenticatedDashboard();

    cy.contains("h1", "Dashboard").should("be.visible");
    cy.contains(user.email).should("be.visible");

    cy.contains("button", "Ouvrir le menu").click();
    cy.contains('[role="menuitem"]', "Modifier").click();
    cy.contains("Modifier l'utilisateur").should("be.visible");
    cy.contains("button", "Annuler").click();

    cy.contains("button", "Ouvrir le menu").click();
    cy.contains('[role="menuitem"]', "Supprimer").click();
    cy.contains("Supprimer l'utilisateur ?").should("be.visible");
    cy.contains("Jean Dupont").should("be.visible");
  });

  it("logs out authenticated users", () => {
    visitAuthenticatedDashboard();

    cy.contains("button", "Déconnexion").click();

    cy.window()
      .its("sessionStorage")
      .invoke("getItem", authStorageKey)
      .should("be.null");
    cy.contains("button", "Se connecter").should("be.disabled");
  });
});
