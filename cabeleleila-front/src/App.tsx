import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BookingPage from "./pages/BookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import RevenuePage from "./pages/RevenuePage";
import ServiceManagerPage from "./pages/ServiceManagerPage";
import CalendarPage from "./pages/CalendarPage";
import Profile from "./pages/Profile"; 
import { Box } from "@mui/material";
import styled from "styled-components";
import type { JSX } from "react";
import Settings from "./pages/Settings";

const MainContent = styled(Box)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: auto;
`;

const ProtectedLayout = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

const AdminRoute = ({ element }: { element: JSX.Element }) => {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? element : <Navigate to="/dashboard" />;
};

const PublicLayout = () => (
  <Box>
    <Outlet />
  </Box>
);

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/bookings/:id" element={<BookingDetailsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        <Route
          path="/revenue"
          element={<AdminRoute element={<RevenuePage />} />}
        />
        <Route
          path="/services"
          element={<AdminRoute element={<ServiceManagerPage />} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
