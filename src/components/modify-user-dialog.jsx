import UserDialog from "@/components/user-dialog";

function ModifyUserDialog({ user, ...props }) {
  return (
    <UserDialog
      formId={`modify-user-form-${user.id}`}
      initialValues={{
        lastName: user.last_name,
        firstName: user.first_name,
        email: user.email,
        birthDate: user.birthdate,
        city: user.city,
        postalCode: user.postal_code,
      }}
      triggerLabel="Modifier"
      title="Modifier l'utilisateur"
      description="Mettez a jour les informations de l'utilisateur."
      submitLabel="Modifier"
      {...props}
    />
  );
}

export default ModifyUserDialog;
