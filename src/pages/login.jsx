import LoginForm from "../components/login-form";

function Login({ onLogin }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <LoginForm onLogin={onLogin} />
    </div>
  );
}

export default Login;
