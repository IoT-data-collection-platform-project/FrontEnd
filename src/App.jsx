import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import Signup from "./Signup";
import Weather from "./Weather";
import { apiFetch } from "./api";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    apiFetch("/api/auth/me")
      .then((response) => {
        if (!active) {
          return;
        }

        setStatus(response.ok ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (active) {
          setStatus("unauthenticated");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p>로그인 상태를 확인하는 중...</p>;
  }

  return status === "authenticated" ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;