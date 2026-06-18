import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createUser, deleteUser, fetchUsers, updateUser } from "@/api/users";
import Dashboard from "./dashboard";

const mockFormData = {
  lastName: "Durand",
  firstName: "Marie",
  email: "marie.durand@example.com",
  birthDate: "1998-05-20",
  city: "Lyon",
  postalCode: "69001",
};

const mockUser = {
  id: 1,
  last_name: "Dupont",
  first_name: "Jean",
  email: "jean.dupont@example.com",
  birthdate: "2000-01-15",
  city: "Paris",
  postal_code: "75001",
};

jest.mock("@/api/users", () => ({
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  fetchUsers: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock("@/components/create-user-dialog", () => ({
  __esModule: true,
  default: function MockCreateUserDialog({ onSubmit }) {
    return (
      <button type="button" onClick={() => onSubmit(mockFormData)}>
        mock-create-user
      </button>
    );
  },
}));

jest.mock("@/components/users-table", () => ({
  __esModule: true,
  default: function MockUsersTable({
    isDeletingUser,
    isLoading,
    onDeleteUser,
    onModifyUser,
    users,
  }) {
    return (
      <section aria-label="mock-users-table">
        <span>users-count:{users.length}</span>
        <span>loading:{String(isLoading)}</span>
        <span>delete-pending:{String(isDeletingUser)}</span>
        <button type="button" onClick={() => onModifyUser(mockUser)}>
          mock-open-modify
        </button>
        <button type="button" onClick={() => onDeleteUser(mockUser)}>
          mock-open-delete
        </button>
      </section>
    );
  },
}));

jest.mock("@/components/modify-user-dialog", () => ({
  __esModule: true,
  default: function MockModifyUserDialog({ onOpenChange, onSubmit, user }) {
    return (
      <section aria-label="mock-modify-dialog">
        <span>modify-user:{user.email}</span>
        <button type="button" onClick={() => onOpenChange(true)}>
          mock-keep-modify-open
        </button>
        <button type="button" onClick={() => onOpenChange(false)}>
          mock-close-modify
        </button>
        <button type="button" onClick={() => onSubmit(mockFormData)}>
          mock-submit-modify
        </button>
      </section>
    );
  },
}));

jest.mock("@/components/delete-user-dialog", () => ({
  __esModule: true,
  default: function MockDeleteUserDialog({
    isSubmitting,
    onOpenChange,
    onSubmit,
    user,
  }) {
    return (
      <section aria-label="mock-delete-dialog">
        <span>delete-user:{user.email}</span>
        <span>delete-dialog-pending:{String(isSubmitting)}</span>
        <button type="button" onClick={() => onOpenChange(true)}>
          mock-keep-delete-open
        </button>
        <button type="button" onClick={() => onOpenChange(false)}>
          mock-close-delete
        </button>
        <button type="button" onClick={onSubmit}>
          mock-confirm-delete
        </button>
      </section>
    );
  },
}));

function renderDashboard(onLogout = jest.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Dashboard onLogout={onLogout} />
    </QueryClientProvider>,
  );

  return { onLogout, queryClient };
}

describe("Dashboard", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
    fetchUsers.mockResolvedValue([mockUser]);
    createUser.mockResolvedValue(mockUser);
    updateUser.mockResolvedValue(mockUser);
    deleteUser.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete globalThis.fetch;
  });

  it("loads users and passes them to the table", async () => {
    renderDashboard();

    expect(await screen.findByText("users-count:1")).toBeInTheDocument();
    expect(screen.getByText("loading:false")).toBeInTheDocument();
    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });

  it("creates a user and refreshes the users query", async () => {
    renderDashboard();

    await screen.findByText("users-count:1");
    fireEvent.click(screen.getByRole("button", { name: "mock-create-user" }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalled();
    });
    expect(createUser.mock.calls[0][0]).toEqual(mockFormData);
    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(2);
    });
  });

  it("opens, submits and closes the modify dialog", async () => {
    renderDashboard();

    await screen.findByText("users-count:1");
    fireEvent.click(screen.getByRole("button", { name: "mock-open-modify" }));

    expect(screen.getByLabelText("mock-modify-dialog")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "mock-keep-modify-open" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "mock-submit-modify" }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalled();
    });
    expect(updateUser.mock.calls[0][0]).toEqual({
      id: mockUser.id,
      user: mockFormData,
    });

    fireEvent.click(screen.getByRole("button", { name: "mock-close-modify" }));

    expect(
      screen.queryByLabelText("mock-modify-dialog"),
    ).not.toBeInTheDocument();
  });

  it("opens, confirms and closes the delete dialog", async () => {
    renderDashboard();

    await screen.findByText("users-count:1");
    fireEvent.click(screen.getByRole("button", { name: "mock-open-delete" }));

    expect(screen.getByLabelText("mock-delete-dialog")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "mock-keep-delete-open" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "mock-confirm-delete" }));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
    });
    expect(deleteUser.mock.calls[0][0]).toBe(mockUser.id);
    await waitFor(() => {
      expect(
        screen.queryByLabelText("mock-delete-dialog"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes the delete dialog without deleting", async () => {
    renderDashboard();

    await screen.findByText("users-count:1");
    fireEvent.click(screen.getByRole("button", { name: "mock-open-delete" }));
    fireEvent.click(screen.getByRole("button", { name: "mock-close-delete" }));

    expect(deleteUser).not.toHaveBeenCalled();
    expect(
      screen.queryByLabelText("mock-delete-dialog"),
    ).not.toBeInTheDocument();
  });

  it("calls onLogout from the logout button", () => {
    const onLogout = jest.fn();

    renderDashboard(onLogout);
    fireEvent.click(screen.getByRole("button", { name: "Déconnexion" }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
