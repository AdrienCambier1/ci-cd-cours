import { fireEvent, render, screen } from "@testing-library/react";
import LoginForm from "./login-form";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

describe("LoginForm", () => {
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
});
