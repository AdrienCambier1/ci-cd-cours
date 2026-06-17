import { useMemo, useState } from "react";
import { validateForm } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyFormData = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: "",
};

const emptyErrors = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: "",
};

function FormField({ id, label, error, children }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <span id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}

function UserDialog({
  initialValues,
  onSubmit,
  triggerLabel,
  title,
  description,
  submitLabel,
  formId = "user-form",
}) {
  const defaultFormData = useMemo(
    () => ({ ...emptyFormData, ...initialValues }),
    [initialValues],
  );
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(emptyErrors);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setFormData(defaultFormData);
      setErrors(emptyErrors);
      setSubmitError("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const validatedData = validateForm(formData);

      setErrors(emptyErrors);
      setSubmitError("");
      setIsSubmitting(true);
      await onSubmit?.(validatedData);
      setOpen(false);
    } catch (error) {
      if (error.errors) {
        setErrors({ ...emptyErrors, ...error.errors });
        return;
      }

      setSubmitError("Impossible d'enregistrer l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="lastName" label="Nom" error={errors.lastName}>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
                />
              </FormField>

              <FormField id="firstName" label="Prenom" error={errors.firstName}>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                />
              </FormField>
            </div>

            <FormField id="email" label="Email" error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </FormField>

            <FormField
              id="birthDate"
              label="Date de naissance"
              error={errors.birthDate}
            >
              <DatePickerInput
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                aria-invalid={!!errors.birthDate}
                aria-describedby={
                  errors.birthDate ? "birthDate-error" : undefined
                }
              />
            </FormField>

            <FormField id="city" label="Ville" error={errors.city}>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? "city-error" : undefined}
              />
            </FormField>

            <FormField
              id="postalCode"
              label="Code postal"
              error={errors.postalCode}
            >
              <Input
                id="postalCode"
                name="postalCode"
                inputMode="numeric"
                maxLength={5}
                value={formData.postalCode}
                onChange={handleChange}
                aria-invalid={!!errors.postalCode}
                aria-describedby={
                  errors.postalCode ? "postalCode-error" : undefined
                }
              />
            </FormField>
          </div>
        </form>

        {submitError && (
          <p role="alert" className="text-sm text-destructive">
            {submitError}
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Annuler
          </DialogClose>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDialog;
