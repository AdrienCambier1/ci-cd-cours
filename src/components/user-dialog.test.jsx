import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CreateUserDialog from "./create-user-dialog";
import ModifyUserDialog from "./modify-user-dialog";
import UserDialog from "./user-dialog";

const validFormData = {
  lastName: "Dupont",
  firstName: "Jean",
  email: "jean.dupont@example.com",
  birthDate: "2000-01-15",
  city: "Paris",
  postalCode: "75001",
};

const invalidFormData = {
  lastName: "D",
  firstName: "J",
  email: "jean.dupont@example.com",
  birthDate: "2999-01-15",
  city: "Paris1",
  postalCode: "75",
};

const userFixture = {
  id: 1,
  last_name: "Dupont",
  first_name: "Jean",
  email: "jean.dupont@example.com",
  birthdate: "2000-01-15",
  city: "Paris",
  postal_code: "75001",
};

describe("UserDialog", () => {
  it("opens from its trigger with the configured title and description", async () => {
    render(
      <UserDialog
        triggerLabel="Ajouter"
        title="Ajouter un utilisateur"
        description="Renseignez les informations."
        submitLabel="Creer"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(
      await screen.findByRole("heading", { name: "Ajouter un utilisateur" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Renseignez les informations.")).toBeInTheDocument();
  });

  it("disables submit until required fields are complete", () => {
    render(
      <UserDialog
        open
        title="Creer un utilisateur"
        description="Renseignez les informations."
        submitLabel="Creer"
      />,
    );

    expect(screen.getByRole("button", { name: "Creer" })).toBeDisabled();
  });

  it("shows validation errors next to invalid filled fields", async () => {
    const onSubmit = jest.fn();

    render(
      <UserDialog
        open
        initialValues={invalidFormData}
        onSubmit={onSubmit}
        title="Creer un utilisateur"
        description="Renseignez les informations."
        submitLabel="Creer"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Creer" }));

    expect(await screen.findAllByText(/^Minimum 2/)).toHaveLength(2);
    expect(
      screen.getByText("Vous devez avoir au moins 18 ans"),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Caract/)).toBeInTheDocument();
    expect(
      screen.getByText("Format invalide (5 chiffres requis)"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears a field error when the field changes", async () => {
    render(
      <UserDialog
        open
        initialValues={{ ...validFormData, lastName: "D" }}
        title="Creer un utilisateur"
        description="Renseignez les informations."
        submitLabel="Creer"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Creer" }));

    const lastNameInput = screen.getByLabelText("Nom");
    expect(await screen.findByText(/^Minimum 2/)).toBeInTheDocument();
    expect(lastNameInput).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(lastNameInput, { target: { value: "Dupont" } });

    expect(lastNameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("submits validated data and closes the controlled dialog", async () => {
    const onOpenChange = jest.fn();
    const onSubmit = jest.fn(() => Promise.resolve());

    render(
      <UserDialog
        open
        initialValues={validFormData}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        title="Modifier l'utilisateur"
        description="Mettez a jour les informations."
        submitLabel="Modifier"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Modifier" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(validFormData);
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps server field errors on the matching input", async () => {
    const onOpenChange = jest.fn();
    const submitError = new Error("Email deja utilise");
    submitError.errors = { email: "Email deja utilise" };
    const onSubmit = jest.fn(() => Promise.reject(submitError));

    render(
      <UserDialog
        open
        initialValues={validFormData}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        title="Modifier l'utilisateur"
        description="Mettez a jour les informations."
        submitLabel="Modifier"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Modifier" }));

    expect(await screen.findByText("Email deja utilise")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("stays open when submit fails without field errors", async () => {
    const onOpenChange = jest.fn();
    const onSubmit = jest.fn(() => Promise.reject(new Error("Network error")));

    render(
      <UserDialog
        open
        initialValues={validFormData}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        title="Modifier l'utilisateur"
        description="Mettez a jour les informations."
        submitLabel="Modifier"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Modifier" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(validFormData);
    });
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Modifier" })).toBeEnabled();
  });

  it("renders the create dialog labels", async () => {
    render(<CreateUserDialog />);

    fireEvent.click(
      screen.getByRole("button", { name: "Ajouter un utilisateur" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Créer un utilisateur" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Renseignez les informations de l'utilisateur."),
    ).toBeInTheDocument();
  });

  it("renders the modify dialog with the selected user values", () => {
    render(<ModifyUserDialog user={userFixture} open />);

    expect(
      screen.getByRole("heading", { name: "Modifier l'utilisateur" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toHaveValue("Dupont");
    expect(screen.getByLabelText("Prenom")).toHaveValue("Jean");
    expect(screen.getByLabelText("Email")).toHaveValue(
      "jean.dupont@example.com",
    );
    expect(screen.getByLabelText("Ville")).toHaveValue("Paris");
    expect(screen.getByLabelText("Code postal")).toHaveValue("75001");
  });
});
