import styled from "styled-components";
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    scheduledDate: "",
    status: "",
    notes: "",
    services: [] as any[],
    totalAmount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, servicesRes] = await Promise.all([
          api.get(`/bookings/${id}`),
          api.get("/services"),
        ]);

        const bookingData = bookingRes.data;
        setAllServices(servicesRes.data);
        setBooking(bookingData);

        setFormData({
          scheduledDate: bookingData.scheduledDate,
          status: bookingData.status,
          notes: bookingData.notes || "",
          services: bookingData.services || [],
          totalAmount: bookingData.totalAmount || 0,
        });
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: any) => {
    const currentIndex = formData.services.findIndex(
      (s: any) => s.id === service.id
    );
    const newServices = [...formData.services];

    if (currentIndex === -1) {
      newServices.push(service);
    } else {
      newServices.splice(currentIndex, 1);
    }

    const totalAmount = newServices.reduce((sum, s) => sum + s.price, 0);
    setFormData((prev) => ({
      ...prev,
      services: newServices,
      totalAmount,
    }));
  };

  const handleUpdateBooking = async () => {
    try {
      const payload = {
        scheduledDate: formData.scheduledDate,
        status: formData.status,
        notes: formData.notes,
        services: formData.services.map((service) => ({ id: service.id })),
        totalAmount: formData.totalAmount,
        client: { id: booking.client.id },
      };

      const updatedBooking = await api.put(`/bookings/${id}`, payload);
      setBooking(updatedBooking.data);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update booking", error);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      await api.delete(`/bookings/${id}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete booking", error);
    }
  };

  if (loading) {
    return (
      <DetailsContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold" color="#3f51b5">
            Booking Details
          </Typography>
          <Chip
            label={booking.status}
            color={statusColors[booking.status] || "default"}
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {editMode ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Appointment Details
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                label="Date & Time"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {Object.keys(statusColors).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Total Amount"
                value={`$${formData.totalAmount.toFixed(2)}`}
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Services
              </Typography>
              <List dense>
                {allServices.map((service) => (
                  <ListItem key={service.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleServiceToggle(service)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={formData.services.some(
                            (s: any) => s.id === service.id
                          )}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={service.name}
                        secondary={`$${service.price.toFixed(2)}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        ) : (
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
                    secondary={dayjs(booking.scheduledDate).format(
                      "DD/MM/YYYY HH:mm"
                    )}
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
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {booking.notes}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {user?.role === "ADMIN" && (
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            {editMode ? (
              <>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateBooking}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteConfirm(true)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              </>
            )}
          </Box>
        )}
      </DetailsCard>

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteBooking}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DetailsContainer>
  );
}
