import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import UserActionsMenu from "@/components/user-actions-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function UsersTable({ isDeletingUser, onDeleteUser, onModifyUser, users }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "last_name",
        header: "Nom",
      },
      {
        accessorKey: "first_name",
        header: "Prenom",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "birthdate",
        header: "Date de naissance",
      },
      {
        accessorKey: "city",
        header: "Ville",
      },
      {
        accessorKey: "postal_code",
        header: "Code postal",
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="text-right">
              <UserActionsMenu
                isDeleteDisabled={isDeletingUser}
                onDelete={() => onDeleteUser(user)}
                onModify={() => onModifyUser(user)}
              />
            </div>
          );
        },
      },
    ],
    [isDeletingUser, onDeleteUser, onModifyUser],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is the shadcn data-table recommendation.
  const table = useReactTable({
    columns,
    data: users,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Aucun utilisateur.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default UsersTable;
