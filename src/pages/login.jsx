import LoginForm from "../components/login-form";

function Login({ onLogin }) {
  return (
    <main className="min-h-full w-full p-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <LoginForm onLogin={onLogin} />
      </div>
    </main>
  );
}

export default Login;
