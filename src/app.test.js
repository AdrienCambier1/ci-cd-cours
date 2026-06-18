import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";
import { setIsAuthenticated } from "./auth";
import Dashboard from "./pages/dashboard";
import { queryClient } from "./query-client";

const userFixture = {
  id: 1,
  last_name: "Dupont",
  first_name: "Jean",
  email: "jean.dupont@example.com",
  birthdate: "2000-01-15",
  city: "Paris",
  postal_code: "75001",
  created_at: "2026-06-15T13:38:05",
};

function mockUsersFetch(users = [userFixture]) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ users }),
    }),
  );
}

describe("App", () => {
  beforeEach(() => {
    queryClient.clear();
    setIsAuthenticated(false);
    delete globalThis.fetch;
  });

  it("redirects app root route to login form", () => {
    window.history.pushState({}, "", "/ci-cd-cours/");

    render(<App />);

    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders the login route", () => {
    window.history.pushState({}, "", "/ci-cd-cours/login");

    render(<App />);

    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("redirects the dashboard route to login form when not authenticated", () => {
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders the dashboard route when authenticated", async () => {
    setIsAuthenticated(true);
    mockUsersFetch();
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("jean.dupont@example.com"),
    ).toBeInTheDocument();
  });

  it("opens the row actions menu and modify dialog", async () => {
    setIsAuthenticated(true);
    mockUsersFetch();
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

    expect(
      await screen.findByText("jean.dupont@example.com"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Modifier"));

    expect(
      await screen.findByRole("heading", {
        name: "Modifier l'utilisateur",
      }),
    ).toBeInTheDocument();
  });

  it("opens the row actions menu and delete dialog", async () => {
    setIsAuthenticated(true);
    mockUsersFetch();
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

    expect(
      await screen.findByText("jean.dupont@example.com"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Supprimer"));

    expect(
      await screen.findByRole("heading", {
        name: "Supprimer l'utilisateur ?",
      }),
    ).toBeInTheDocument();
  });

  it("logs out from the dashboard", async () => {
    setIsAuthenticated(true);
    mockUsersFetch();
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: "Deconnexion" }));

    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders dashboard when fetch is not available", () => {
    delete globalThis.fetch;
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  it("redirects unknown routes to login form", () => {
    window.history.pushState({}, "", "/ci-cd-cours/unknown");

    render(<App />);

    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
