import { useEffect, useState } from "react";
import RegistrationForm from "./components/registrationForm";

function App() {
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    if (!globalThis.fetch) {
      return;
    }

    fetch("http://localhost:8000/users")
      .then((response) => response.json())
      .then((data) => setUsersCount(data.users.length));
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        Utilisateurs: {usersCount}
      </p>
      <RegistrationForm />
    </div>
  );
}

export default App;
