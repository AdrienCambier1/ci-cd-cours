import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState = {
  username: "",
  password: "",
};

function LoginForm({
  authUsername = process.env.AUTH_USERNAME,
  authPassword = process.env.AUTH_PASSWORD,
  onLogin,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  const isComplete = Object.values(formData).every((v) => v.trim() !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.username === authUsername &&
      formData.password === authPassword
    ) {
      setError("");
      onLogin?.();
      navigate("/dashboard");
      return;
    }

    setError("Identifiant ou mot de passe invalides");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Se connecter</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour acceder au dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={handleSubmit}
          aria-label="Formulaire de connexion"
        >
          <FieldGroup>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="username">Utilisateur</FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={!!error}
              />
            </Field>

            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!error}
              />
              <FieldError>{error}</FieldError>
            </Field>
            <Field>
              <Button
                type="submit"
                form="login-form"
                className="w-full"
                disabled={!isComplete}
              >
                Se connecter
              </Button>
              <FieldDescription className="text-center">
                Pas de compte?{" "}
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&autoplay=1">
                  S'inscrire
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
