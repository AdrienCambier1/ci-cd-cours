import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getIsAuthenticated, setIsAuthenticated } from "./auth";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import { queryClient } from "./query-client";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(getIsAuthenticated);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthenticated(false);
    queryClient.clear();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/ci-cd-cours">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
