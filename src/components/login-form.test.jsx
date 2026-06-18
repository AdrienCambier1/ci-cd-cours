import { fireEvent, render, screen } from "@testing-library/react";
import LoginForm from "./login-form";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders username, password and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Utilisateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeDisabled();
  });

  it("updates field values on change", () => {
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("Utilisateur");
    const passwordInput = screen.getByLabelText("Mot de passe");

    fireEvent.change(usernameInput, { target: { value: "adrien" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(usernameInput).toHaveValue("adrien");
    expect(passwordInput).toHaveValue("secret");
    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeEnabled();
  });

  it("shows an error when credentials are invalid", () => {
    const onLogin = jest.fn();

    render(
      <LoginForm
        authUsername="admin"
        authPassword="secret"
        onLogin={onLogin}
      />,
    );

    fireEvent.change(screen.getByLabelText("Utilisateur"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(screen.getByText("Identifiants invalides")).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("calls onLogin and redirects to dashboard when credentials are valid", () => {
    const onLogin = jest.fn();

    render(
      <LoginForm
        authUsername="admin"
        authPassword="secret"
        onLogin={onLogin}
      />,
    );

    fireEvent.change(screen.getByLabelText("Utilisateur"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
