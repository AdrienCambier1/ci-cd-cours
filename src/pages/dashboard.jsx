import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, fetchUsers, updateUser } from "@/api/users";
import CreateUserDialog from "@/components/create-user-dialog";
import ModifyUserDialog from "@/components/modify-user-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Dashboard() {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
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

  const handleCreateUser = (user) => createUserMutation.mutateAsync(user);

  const handleUpdateUser = (id, user) =>
    updateUserMutation.mutateAsync({ id, user });

  return (
    <main className="w-full min-h-full p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <CreateUserDialog onSubmit={handleCreateUser} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prenom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Code postal</TableHead>
              <TableHead>Cree le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.birthdate}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.postal_code}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>
                  <ModifyUserDialog
                    user={user}
                    onSubmit={(updatedUser) =>
                      handleUpdateUser(user.id, updatedUser)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default Dashboard;
