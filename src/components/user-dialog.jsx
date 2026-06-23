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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  );
}

function UserDialog({
  initialValues,
  onSubmit,
  open,
  onOpenChange,
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
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpen) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);

    if (nextOpen) {
      setFormData(defaultFormData);
      setErrors(emptyErrors);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const validatedData = validateForm(formData);

      setErrors(emptyErrors);
      setIsSubmitting(true);
      await onSubmit?.(validatedData);
      handleOpenChange(false);
    } catch (error) {
      if (error.errors) {
        setErrors({ ...emptyErrors, ...error.errors });
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {triggerLabel && (
        <DialogTrigger render={<Button type="button" />}>
          {triggerLabel}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <FormField id="lastName" label="Nom" error={errors.lastName}>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  onChange={handleChange}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                />
              </FormField>
            </FieldGroup>

            <FormField id="email" label="Email" error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                onChange={handleChange}
                aria-invalid={!!errors.postalCode}
                aria-describedby={
                  errors.postalCode ? "postalCode-error" : undefined
                }
              />
            </FormField>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose
            render={
              <Button disabled={isSubmitting} type="button" variant="outline" />
            }
          >
            Annuler
          </DialogClose>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? `${submitLabel}...` : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDialog;
