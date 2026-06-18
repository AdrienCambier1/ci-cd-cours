import { fireEvent, render, screen } from "@testing-library/react";
import UsersTable from "./users-table";

const userFixture = {
  id: 1,
  last_name: "Dupont",
  first_name: "Jean",
  email: "jean.dupont@example.com",
  birthdate: "2000-01-15",
  city: "Paris",
  postal_code: "75001",
};

describe("UsersTable", () => {
  it("renders table headers and users", () => {
    render(
      <UsersTable
        users={[userFixture]}
        onModifyUser={jest.fn()}
        onDeleteUser={jest.fn()}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Nom" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Prenom" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Email" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Date de naissance" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Ville" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Code postal" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dupont")).toBeInTheDocument();
    expect(screen.getByText("Jean")).toBeInTheDocument();
    expect(screen.getByText("jean.dupont@example.com")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("renders an empty state when there are no users", () => {
    render(
      <UsersTable users={[]} onModifyUser={jest.fn()} onDeleteUser={jest.fn()} />,
    );

    expect(screen.getByText("Aucun utilisateur")).toBeInTheDocument();
    expect(
      screen.getByText("Les utilisateurs crees apparaitront ici."),
    ).toBeInTheDocument();
  });

  it("passes the selected user to the modify handler", async () => {
    const onModifyUser = jest.fn();

    render(
      <UsersTable
        users={[userFixture]}
        onModifyUser={onModifyUser}
        onDeleteUser={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Modifier"));

    expect(onModifyUser).toHaveBeenCalledWith(userFixture);
  });

  it("passes the selected user to the delete handler", async () => {
    const onDeleteUser = jest.fn();

    render(
      <UsersTable
        users={[userFixture]}
        onModifyUser={jest.fn()}
        onDeleteUser={onDeleteUser}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Supprimer"));

    expect(onDeleteUser).toHaveBeenCalledWith(userFixture);
  });
});
