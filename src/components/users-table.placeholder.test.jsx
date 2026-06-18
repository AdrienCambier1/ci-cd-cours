import { render, screen } from "@testing-library/react";

jest.mock("@tanstack/react-table", () => ({
  flexRender: jest.fn((renderable) =>
    typeof renderable === "function" ? renderable({}) : renderable,
  ),
  getCoreRowModel: jest.fn(() => jest.fn()),
  useReactTable: jest.fn(() => ({
    getHeaderGroups: () => [
      {
        id: "placeholder-group",
        headers: [{ id: "placeholder-header", isPlaceholder: true }],
      },
    ],
    getRowModel: () => ({ rows: [] }),
  })),
}));

describe("UsersTable placeholder headers", () => {
  it("renders placeholder headers without content", async () => {
    const { default: UsersTable } = await import("./users-table");

    render(
      <UsersTable users={[]} onModifyUser={jest.fn()} onDeleteUser={jest.fn()} />,
    );

    expect(screen.getByRole("columnheader")).toBeEmptyDOMElement();
  });
});
