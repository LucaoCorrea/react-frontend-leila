import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
} from "@mui/material";
import styled from "styled-components";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";

const CalendarContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 50vh;
  border-radius: 16px;
  padding: 2rem;
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const CalendarCard = styled(Card)`
  padding: 1.5rem;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  @media (max-width: 600px) {
    padding: 0rem;
  }
`;

type Booking = {
  id: number;
  scheduledDate: string;
  client?: {
    name: string;
    email: string;
  };
  services: { name: string }[];
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const response =
          user.role === "ADMIN"
            ? await api.get("/bookings")
            : await api.get(`/bookings/client/${user.id}`);
        setBookings(response.data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const events = bookings.map((booking) => ({
    id: String(booking.id),
    title: booking.services.map((s) => s.name).join(", "),
    start: booking.scheduledDate,
    allDay: false,
  }));

  if (loading) {
    return (
      <CalendarContainer maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" color="#3f51b5" gutterBottom>
        Calendário de Agendamentos
      </Typography>

      <CalendarCard>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          events={events}
          height="auto"
        />
      </CalendarCard>
    </CalendarContainer>
  );
}
