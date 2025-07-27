import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemText,
} from "@mui/material";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const BookingContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem;
`;

const BookingCard = styled(Card)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const BookingTitle = styled(Typography)`
  color: #3f51b5;
  font-weight: 700 !important;
  margin-bottom: 2rem !important;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(45deg, #3f51b5 0%, #6573c3 100%) !important;
  color: white !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  margin-top: 1rem !important;
`;

const BookingItem = styled(Card)`
  margin: 1rem 0;
  border-radius: 12px !important;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const statusColors: Record<string, "warning" | "success" | "error" | "primary"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  REQUESTED: "primary",
};

type Service = {
  id: number;
  name: string;
  price: number;
};

type Booking = {
  id: number;
  scheduledDate: string;
  notes: string;
  status: string;
  services: Service[];
};

export default function BookingPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await api.get("/services");
      setServices(response.data);
    };

    const fetchUserBookings = async () => {
      if (!user?.id) return;
      const response = await api.get(`/bookings/client/${user.id}`);
      setUserBookings(response.data);
    };

    fetchServices();
    fetchUserBookings();
  }, [user]);

  useEffect(() => {
    const total = selectedServices.reduce((sum, id) => {
      const s = services.find((s) => s.id === id);
      return sum + (s?.price || 0);
    }, 0);
    setTotalAmount(total);
  }, [selectedServices, services]);

  const handleSubmit = async () => {
    const bookingData = {
      scheduledDate,
      notes,
      status: "REQUESTED",
      client: { id: user?.id },
      services: selectedServices.map((id) => {
        const s = services.find((s) => s.id === id);
        return { id: s?.id, price: s?.price };
      }),
    };

    try {
      const response = await api.post("/bookings", bookingData);
      if (response.status === 200) {
        const newBookingDate = dayjs(scheduledDate);
        const sameWeek = userBookings.find((b) => {
          const d = dayjs(b.scheduledDate);
          return d.isoWeek() === newBookingDate.isoWeek();
        });
        if (sameWeek) {
          alert("Você já tem outro agendamento nesta semana. Deseja combinar no mesmo dia?");
        }
        const bookingsResponse = await api.get(`/bookings/client/${user?.id}`);
        setUserBookings(bookingsResponse.data);
      }
    } catch (error) {
      console.error("Erro ao enviar agendamento", error);
    }
  };

  const openEditDialog = (booking: Booking) => {
    const daysDiff = dayjs(booking.scheduledDate).diff(dayjs(), 'day');
    if (daysDiff < 2) {
      alert("Para editar esse agendamento, entre em contato com Leila: (99) 99999-9999");
      return;
    }
    setScheduledDate(booking.scheduledDate);
    setNotes(booking.notes);
    setSelectedServices(booking.services.map((s) => s.id));
    setEditBookingId(booking.id);
    setEditDialog(true);
  };

  const saveEdit = async () => {
    const bookingData = {
      scheduledDate,
      notes,
      client: { id: user?.id },
      services: selectedServices.map((id) => {
        const s = services.find((s) => s.id === id);
        return { id: s?.id, price: s?.price };
      }),
    };

    try {
      await api.put(`/bookings/${editBookingId}`, bookingData);
      const bookingsResponse = await api.get(`/bookings/client/${user?.id}`);
      setUserBookings(bookingsResponse.data);
      setEditDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BookingContainer maxWidth="md">
      <BookingCard>
        <BookingTitle variant="h4">Novo Agendamento</BookingTitle>

        <TextField
          fullWidth
          label="Data e Hora"
          type="datetime-local"
          margin="normal"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Observações"
          margin="normal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          multiline
          rows={3}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Serviços</InputLabel>
          <Select
            multiple
            value={selectedServices}
            onChange={(e) => setSelectedServices(
              typeof e.target.value === "string"
                ? e.target.value.split(",").map(Number)
                : e.target.value as number[]
            )}
            renderValue={(selected) =>
              selected.map((id) => services.find((s) => s.id === id)?.name).join(", ")
            }
          >
            {services.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                <Checkbox checked={selectedServices.includes(s.id)} />
                <ListItemText primary={`${s.name} - R$ ${s.price}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
          Total: R$ {totalAmount.toFixed(2)}
        </Typography>

        <PrimaryButton
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedServices.length === 0 || !scheduledDate}
        >
          Confirmar
        </PrimaryButton>
      </BookingCard>

      <BookingCard>
        <BookingTitle variant="h4">Seus Agendamentos</BookingTitle>

        {userBookings.length === 0 ? (
          <Typography>Nenhum agendamento encontrado.</Typography>
        ) : (
          userBookings.map((booking) => (
            <BookingItem key={booking.id} elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    {dayjs(booking.scheduledDate).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={booking.status}
                      color={statusColors[booking.status] || "default"}
                      sx={{ fontWeight: "bold" }}
                    />
                    <Button onClick={() => openEditDialog(booking)}>Editar</Button>
                  </Box>
                </Box>
              </CardContent>
            </BookingItem>
          ))
        )}
      </BookingCard>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Editar Agendamento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="datetime-local"
            margin="normal"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Observações"
            margin="normal"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
          <PrimaryButton onClick={saveEdit}>Salvar</PrimaryButton>
        </DialogActions>
      </Dialog>
    </BookingContainer>
  );
}
