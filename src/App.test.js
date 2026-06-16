import { render, screen } from "@testing-library/react";
import App from "./app";

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

  it("renders the dashboard route", () => {
    window.history.pushState({}, "", "/ci-cd-cours/dashboard");

    render(<App />);

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
