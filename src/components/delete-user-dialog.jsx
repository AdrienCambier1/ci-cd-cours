import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DeleteUserDialog({
  isSubmitting,
  onOpenChange,
  onSubmit,
  open,
  user,
}) {
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'utilisateur ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera definitivement{" "}
            {fullName || "cet utilisateur"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Supprimer..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUserDialog;
