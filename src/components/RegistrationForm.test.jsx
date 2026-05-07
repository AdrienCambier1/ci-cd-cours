import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";

const selectBirthDate = (date) => {
  const [year, month] = date.split("-");

  fireEvent.click(
    screen.getByRole("button", { name: "Sélectionner une date" }),
  );
  fireEvent.change(screen.getByLabelText("Choose the Year"), {
    target: { value: year },
  });
  fireEvent.change(screen.getByLabelText("Choose the Month"), {
    target: { value: String(Number(month) - 1) },
  });

  const dayButton = document.querySelector(
    `[role="gridcell"][data-day="${date}"] button`,
  );
  expect(dayButton).toBeInTheDocument();
  fireEvent.click(dayButton);
};

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Nom"), {
    target: { value: "Dupont" },
  });
  fireEvent.change(screen.getByLabelText("Prénom"), {
    target: { value: "Jean" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "jean@example.com" },
  });
  selectBirthDate("1990-01-01");
  fireEvent.change(screen.getByLabelText("Ville"), {
    target: { value: "Paris" },
  });
  fireEvent.change(screen.getByLabelText("Code postal"), {
    target: { value: "75001" },
  });
};

describe("RegistrationForm Integration Test Suites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render all form fields and the submit button", () => {
    render(<RegistrationForm />);
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Date de naissance")).toBeInTheDocument();
    expect(screen.getByLabelText("Ville")).toBeInTheDocument();
    expect(screen.getByLabelText("Code postal")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "S'inscrire" }),
    ).toBeInTheDocument();
  });

  it("should show all validation errors on empty submit", () => {
    render(<RegistrationForm />);
    fireEvent.submit(screen.getByRole("form"));
    expect(screen.getByTestId("error-lastName")).toBeInTheDocument();
    expect(screen.getByTestId("error-firstName")).toBeInTheDocument();
    expect(screen.getByTestId("error-email")).toBeInTheDocument();
    expect(screen.getByTestId("error-birthDate")).toBeInTheDocument();
    expect(screen.getByTestId("error-city")).toBeInTheDocument();
    expect(screen.getByTestId("error-postalCode")).toBeInTheDocument();
  });

  it("should update field value on change", () => {
    render(<RegistrationForm />);
    const input = screen.getByLabelText("Nom");
    fireEvent.change(input, { target: { value: "Martin" } });
    expect(input.value).toBe("Martin");
  });

  it("should save to localStorage and show success message on valid submit", () => {
    render(<RegistrationForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "S'inscrire" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmer" }));
    expect(screen.getByTestId("success")).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem("registrationData"));
    expect(stored.lastName).toBe("Dupont");
    expect(stored.firstName).toBe("Jean");
    expect(stored.email).toBe("jean@example.com");
    expect(stored.city).toBe("Paris");
    expect(stored.postalCode).toBe("75001");
  });

  it("should prevent typing directly in the birth date field", () => {
    render(<RegistrationForm />);
    const birthDateInput = screen.getByLabelText("Date de naissance");

    expect(birthDateInput).toHaveAttribute("readonly");
    fireEvent.change(birthDateInput, {
      target: { value: "2020-01-01" },
    });

    expect(birthDateInput).toHaveValue("");
  });
});
