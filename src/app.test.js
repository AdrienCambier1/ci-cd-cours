import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";
import Dashboard from "./pages/dashboard";

describe("App", () => {
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

  it("renders the dashboard route", async () => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            users: [
              {
                id: 1,
                last_name: "Dupont",
                first_name: "Jean",
                email: "jean.dupont@example.com",
                birthdate: "2000-01-15",
                city: "Paris",
                postal_code: "75001",
                created_at: "2026-06-15T13:38:05",
              },
            ],
          }),
      }),
    );
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("jean.dupont@example.com"),
    ).toBeInTheDocument();
    delete globalThis.fetch;
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
