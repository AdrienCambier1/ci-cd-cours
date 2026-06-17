import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!globalThis.fetch) {
      return;
    }

    fetch("http://localhost:8000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data.users));
  }, []);

  return (
    <main className="w-full min-h-full p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Code postal</TableHead>
              <TableHead>Créé le</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default Dashboard;
