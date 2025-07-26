import styled from 'styled-components';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grid
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";

const DetailsContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem;
`;

const DetailsCard = styled(Card)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem !important;
  color: #3f51b5 !important;
  font-weight: 600 !important;
`;

const statusColors: {
  [key: string]: "default" | "primary" | "success" | "error" | "warning";
} = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  REQUESTED: "primary",
};

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Failed to fetch booking", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <DetailsContainer>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </DetailsContainer>
    );
  }

  if (!booking) {
    return (
      <DetailsContainer>
        <Typography variant="h6">Booking not found</Typography>
      </DetailsContainer>
    );
  }

  return (
    <DetailsContainer maxWidth={false}>
      <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Back
      </BackButton>

      <DetailsCard>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="#3f51b5">
            Booking Details
          </Typography>
          <Chip
            label={booking.status}
            color={statusColors[booking.status] || "default"}
            sx={{ fontWeight: 'bold', fontSize: '1rem' }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Client Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={booking.clientName || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={booking.clientEmail || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Phone"
                  secondary={booking.clientPhone || "N/A"}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Appointment Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Date & Time"
                  secondary={dayjs(booking.scheduledDate).format("DD/MM/YYYY HH:mm")}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Duration"
                  secondary={`${booking.duration || 60} minutes`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total Amount"
                  secondary={`$${booking.totalAmount?.toFixed(2) || "0.00"}`}
                />
              </ListItem>
            </List>
          </Grid>

          {booking.services?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Services
              </Typography>
              <List>
                {booking.services.map((service: any) => (
                  <ListItem key={service.id}>
                    <ListItemText
                      primary={service.name}
                      secondary={`$${service.price.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          {booking.notes && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Notes
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {booking.notes}
              </Typography>
            </Grid>
          )}
        </Grid>

        {user?.role === "ADMIN" && (
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/bookings/${booking.id}/edit`)}
            >
              Edit Booking
            </Button>
          </Box>
        )}
      </DetailsCard>
    </DetailsContainer>
  );
}