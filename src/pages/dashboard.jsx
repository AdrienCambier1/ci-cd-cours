import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { createUser, deleteUser, fetchUsers, updateUser } from "@/api/users";
import CreateUserDialog from "@/components/create-user-dialog";
import DeleteUserDialog from "@/components/delete-user-dialog";
import ModifyUserDialog from "@/components/modify-user-dialog";
import UsersTable from "@/components/users-table";
import { Button } from "@/components/ui/button";

function Dashboard({ onLogout }) {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: typeof globalThis.fetch === "function",
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleCreateUser = (user) => createUserMutation.mutateAsync(user);

  const handleModifyDialogOpenChange = (open) => {
    if (!open) {
      setEditingUser(null);
    }
  };

  const handleDeleteDialogOpenChange = (open) => {
    if (!open) {
      setDeletingUser(null);
    }
  };

  const handleModifyUser = (user) =>
    updateUserMutation.mutateAsync({ id: editingUser.id, user });

  const handleDeleteUser = () => {
    deleteUserMutation.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  return (
    <main className="min-h-full w-full p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <CreateUserDialog onSubmit={handleCreateUser} />
            <Button type="button" variant="outline" onClick={onLogout}>
              <LogOut />
              Deconnexion
            </Button>
          </div>
        </div>

        <UsersTable
          isDeletingUser={deleteUserMutation.isPending}
          isLoading={isLoading}
          onDeleteUser={setDeletingUser}
          onModifyUser={setEditingUser}
          users={users}
        />

        {editingUser && (
          <ModifyUserDialog
            user={editingUser}
            triggerLabel={null}
            open
            onOpenChange={handleModifyDialogOpenChange}
            onSubmit={handleModifyUser}
          />
        )}

        {deletingUser && (
          <DeleteUserDialog
            isSubmitting={deleteUserMutation.isPending}
            onOpenChange={handleDeleteDialogOpenChange}
            onSubmit={handleDeleteUser}
            open
            user={deletingUser}
          />
        )}
      </div>
    </main>
  );
}

export default Dashboard;
