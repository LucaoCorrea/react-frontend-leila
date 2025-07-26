import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BookingPage from "./pages/BookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={token ? <DashboardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/book"
        element={token ? <BookingPage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/bookings/:id" element={<BookingDetailsPage />} />
    </Routes>
  );
}
