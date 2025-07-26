import { useState, useEffect } from "react";
import styled from 'styled-components';
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
  Chip
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";

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

const statusColors: {
  [key: string]: "default" | "primary" | "success" | "error" | "warning";
} = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  REQUESTED: "primary",
};

export default function BookingPage() {
  type Service = { id: number; name: string; price: number };
  type Booking = {
    id: number;
    scheduledDate: string;
    status: string;
  };

  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

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
    if (selectedService) {
      setTotalAmount(selectedService.price);
    }
  }, [selectedService]);

  const handleChange = (e: SelectChangeEvent) => {
    const selected = services.find(
      (service) => service.id === Number(e.target.value)
    );
    if (selected) {
      setSelectedService(selected);
    }
  };

  const handleSubmit = async () => {
    const bookingData = {
      scheduledDate,
      notes,
      status: "REQUESTED",
      client: { id: user?.id },
      services: selectedService
        ? [{ id: selectedService.id, price: selectedService.price }]
        : [],
    };

    try {
      const response = await api.post("/bookings", bookingData);
      if (response.status === 200) {
        alert("Booking submitted successfully");
        const bookingsResponse = await api.get(`/bookings/client/${user?.id}`);
        setUserBookings(bookingsResponse.data);
      }
    } catch (error) {
      console.error("Error submitting booking", error);
    }
  };

  return (
    <BookingContainer maxWidth="md">
      <BookingCard>
        <BookingTitle variant="h4">New Booking</BookingTitle>
        
        <TextField
          fullWidth
          label="Date & Time"
          type="datetime-local"
          margin="normal"
          onChange={(e) => setScheduledDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
        
        <TextField
          fullWidth
          label="Notes"
          margin="normal"
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          multiline
          rows={3}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Service</InputLabel>
          <Select
            value={selectedService?.id?.toString() || ""}
            onChange={handleChange}
            variant="outlined"
          >
            {services.map((serviceOption) => (
              <MenuItem key={serviceOption.id} value={serviceOption.id}>
                {serviceOption.name} - ${serviceOption.price.toFixed(2)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
        
        <PrimaryButton
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedService || !scheduledDate}
        >
          Submit Booking
        </PrimaryButton>
      </BookingCard>

      <BookingCard>
        <BookingTitle variant="h4">Your Bookings</BookingTitle>
        
        {userBookings.length === 0 ? (
          <Typography>No bookings found.</Typography>
        ) : (
          userBookings.map((booking) => (
            <BookingItem key={booking.id} elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    {dayjs(booking.scheduledDate).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Chip
                    label={booking.status}
                    color={statusColors[booking.status] || "default"}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </CardContent>
            </BookingItem>
          ))
        )}
      </BookingCard>
    </BookingContainer>
  );
}