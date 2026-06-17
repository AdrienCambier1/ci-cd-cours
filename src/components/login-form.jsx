import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

    setError("Identifiants invalides");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
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
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Utilisateur</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={!!error}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!error}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={!isComplete}
        >
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
