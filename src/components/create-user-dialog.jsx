import UserDialog from "@/components/user-dialog";

function CreateUserDialog(props) {
  return (
    <UserDialog
      formId="create-user-form"
      triggerLabel="Creer"
      title="Creer un utilisateur"
      description="Renseignez les informations de l'utilisateur."
      submitLabel="Creer"
      {...props}
    />
  );
}

export default CreateUserDialog;
