import { GalleryVerticalEnd } from "lucide-react";
import LoginForm from "../components/login-form";

function Login({ onLogin }) {
  return (
    <main className="min-h-full w-full p-6 flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Adrien C.
        </a>
        <LoginForm onLogin={onLogin} />
      </div>
    </main>
  );
}

export default Login;
