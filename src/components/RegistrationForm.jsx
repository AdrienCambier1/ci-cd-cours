import { useRef, useState } from "react";
import { validateForm } from "../utils/validation";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePickerInput } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: "",
};

/**
 * Registration form component.
 * Validates all fields on submit and saves valid data to localStorage.
 */
function RegistrationForm() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const videoRef = useRef(null);

  const isComplete = Object.values(formData).every((v) => v.trim() !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateForm(formData);
    setErrors(validationErrors);
    if (valid) {
      setDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    localStorage.setItem("registrationData", JSON.stringify(formData));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div data-testid="success" className="fixed inset-0 z-50 bg-black">
        <video
          ref={videoRef}
          src={`${import.meta.env.BASE_URL}rickroll.mp4`}
          autoPlay
          playsInline
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Remplissez le formulaire pour vous inscrire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="registration-form"
            onSubmit={handleSubmit}
            aria-label="Formulaire d'inscription"
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <span
                      data-testid="error-lastName"
                      className="text-xs text-destructive"
                    >
                      {errors.lastName}
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <span
                      data-testid="error-firstName"
                      className="text-xs text-destructive"
                    >
                      {errors.firstName}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean.dupont@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span
                    data-testid="error-email"
                    className="text-xs text-destructive"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <DatePickerInput
                  id="birthDate"
                  name="birthDate"
                  onChange={handleChange}
                  aria-invalid={!!errors.birthDate}
                />
                {errors.birthDate && (
                  <span
                    data-testid="error-birthDate"
                    className="text-xs text-destructive"
                  >
                    {errors.birthDate}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={handleChange}
                  aria-invalid={!!errors.city}
                />
                {errors.city && (
                  <span
                    data-testid="error-city"
                    className="text-xs text-destructive"
                  >
                    {errors.city}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="75001"
                  maxLength={5}
                  value={formData.postalCode}
                  onChange={handleChange}
                  aria-invalid={!!errors.postalCode}
                />
                {errors.postalCode && (
                  <span
                    data-testid="error-postalCode"
                    className="text-xs text-destructive"
                  >
                    {errors.postalCode}
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="registration-form"
            className="w-full"
            disabled={!isComplete}
          >
            S&apos;inscrire
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l&apos;inscription</AlertDialogTitle>
            <AlertDialogDescription>
              Vos informations seront enregistrées. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RegistrationForm;
