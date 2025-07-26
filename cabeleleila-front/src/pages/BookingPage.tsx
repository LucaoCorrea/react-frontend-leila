import { useState, useEffect } from "react";
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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

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
      }
    } catch (error) {
      console.error("Error submitting booking", error);
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">New Booking</Typography>
        <TextField
          fullWidth
          label="Date & Time"
          type="datetime-local"
          margin="normal"
          onChange={(e) => setScheduledDate(e.target.value)}
        />
        <TextField
          fullWidth
          label="Notes"
          margin="normal"
          onChange={(e) => setNotes(e.target.value)}
        />
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Service</InputLabel>
            <Select
              value={selectedService?.id?.toString() || ""}
              onChange={handleChange}
            >
              {services.map((serviceOption) => (
                <MenuItem key={serviceOption.id} value={serviceOption.id}>
                  {serviceOption.name} - ${serviceOption.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, ml: 2 }}
        >
          Submit Booking
        </Button>
        <Box mt={4}>
          <Typography variant="h6">Your Bookings</Typography>
          {userBookings.map((booking) => (
            <Typography key={booking.id} sx={{ mt: 1 }}>
              {booking.scheduledDate} - {booking.status}
            </Typography>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
