import { fireEvent, render, screen } from "@testing-library/react";
import UserActionsMenu from "./user-actions-menu";

describe("UserActionsMenu", () => {
  it("opens the actions menu and calls onModify", async () => {
    const onModify = jest.fn();

    render(<UserActionsMenu onModify={onModify} />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Modifier"));

    expect(onModify).toHaveBeenCalledTimes(1);
  });

  it("opens the actions menu and calls onDelete", async () => {
    const onDelete = jest.fn();

    render(<UserActionsMenu onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Supprimer"));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not call onDelete when delete is disabled", async () => {
    const onDelete = jest.fn();

    render(<UserActionsMenu isDeleteDisabled onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    fireEvent.click(await screen.findByText("Supprimer"));

    expect(onDelete).not.toHaveBeenCalled();
  });
});
