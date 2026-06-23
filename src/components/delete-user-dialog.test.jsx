import { fireEvent, render, screen } from "@testing-library/react";
import DeleteUserDialog from "./delete-user-dialog";

const userFixture = {
  first_name: "Jean",
  last_name: "Dupont",
};

describe("DeleteUserDialog", () => {
  it("renders the selected user and calls onSubmit when confirmed", () => {
    const onSubmit = jest.fn();

    render(
      <DeleteUserDialog
        open
        isSubmitting={false}
        onSubmit={onSubmit}
        user={userFixture}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Supprimer l'utilisateur ?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cette action supprimera definitivement Jean Dupont\./),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables actions while deletion is pending", () => {
    const onSubmit = jest.fn();

    render(
      <DeleteUserDialog
        open
        isSubmitting
        onSubmit={onSubmit}
        user={{ first_name: "", last_name: "" }}
      />,
    );

    expect(
      screen.getByText(
        /Cette action supprimera definitivement cet utilisateur\./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Supprimer..." })).toBeDisabled();
  });
});
