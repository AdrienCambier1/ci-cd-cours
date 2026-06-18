import LoginForm from "../components/login-form";

function Login({ onLogin }) {
  return (
    <main className="min-h-full w-full p-6">
      <LoginForm onLogin={onLogin} />
    </main>
  );
}

export default Login;
