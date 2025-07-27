import styled from "styled-components";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Chip,
  Grid,
  Avatar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
  Event,
  Person,
  CalendarToday,
  Info,
  Logout,
} from "@mui/icons-material";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DashboardContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem;
`;

const HeaderBox = styled(Box)`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterBox = styled(Box)`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ContentBox = styled(Box)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(45deg, #3f51b5 0%, #6573c3 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  &:hover {
    background: linear-gradient(45deg, #6573c3 0%, #3f51b5 100%);
  }
`;

const SecondaryButton = styled(Button)`
  border: 2px solid #3f51b5;
  color: #3f51b5;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  &:hover {
    background: rgba(63, 81, 181, 0.08);
  }
`;

const DetailsButton = styled(Button)`
  color: #3f51b5;
  font-weight: 600;
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 4px;
`;

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REQUESTED";

const statusColors: Record<BookingStatus, "warning" | "success" | "error" | "primary"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  REQUESTED: "primary",
};

export default function DashboardPage() {
  interface Booking {
    id: string;
    scheduledDate: string;
    status: BookingStatus;
    clientName?: string;
    // add other fields as needed
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user, logout } = useAuth();

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response =
        user.role === "ADMIN"
          ? await api.get("/bookings")
          : await api.get(`/bookings/client/${user.id}`);

      let data = response.data.filter((b: any) => {
        const matchesStart =
          !startDate || dayjs(b.scheduledDate).isSameOrAfter(dayjs(startDate));
        const matchesEnd =
          !endDate || dayjs(b.scheduledDate).isSameOrBefore(dayjs(endDate));
        return matchesStart && matchesEnd;
      });

      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <DashboardContainer maxWidth={false}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={60} />
        </Box>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer maxWidth={false}>
      <HeaderBox>
        <UserInfo>
          <Avatar sx={{ bgcolor: "#3f51b5" }}>
            {user?.sub?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {user?.sub || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
        </UserInfo>
        <SecondaryButton startIcon={<Logout />} onClick={logout}>
          Logout
        </SecondaryButton>
      </HeaderBox>

      <FilterBox>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          variant="outlined"
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          variant="outlined"
        />
        <PrimaryButton startIcon={<CalendarToday />} onClick={fetchBookings}>
          Filter
        </PrimaryButton>
      </FilterBox>

      <ContentBox>
        {user?.role === "USER" && (
          <>
            <Box mb={3}>
              <PrimaryButton
                startIcon={<Event />}
                onClick={() => navigate("/book")}
              >
                Book Appointment
              </PrimaryButton>
            </Box>

            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#3f51b5"
            >
              Your Bookings
            </Typography>

            {bookings.length === 0 ? (
              <Typography>No bookings found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((booking) => (
                  <Grid item xs={12} sm={6} key={booking.id}>
                    <StyledCard elevation={3}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <CalendarToday color="action" fontSize="small" />
                          <Typography variant="subtitle1" fontWeight="bold">
                            {dayjs(booking.scheduledDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Chip
                            label={booking.status}
                            color={statusColors[booking.status] || "default"}
                            sx={{ fontWeight: "bold" }}
                          />
                          <DetailsButton
                            size="small"
                            startIcon={<Info />}
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                          >
                            Details
                          </DetailsButton>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#3f51b5"
            >
              All Bookings
            </Typography>

            {bookings.length === 0 ? (
              <Typography>No bookings found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((booking) => (
                  <Grid item xs={12} key={booking.id}>
                    <StyledCard elevation={3}>
                      <CardContent
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <Person color="action" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {booking.clientName}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(booking.scheduledDate).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </Typography>
                          </Box>
                        </Box>

                        <Chip
                          label={booking.status}
                          color={statusColors[booking.status] || "default"}
                          sx={{ 
                            fontWeight: "bold",
                            fontSize: '0.875rem',
                            minWidth: 100
                          }}
                        />

                        <DetailsButton
                          startIcon={<Info />}
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                        >
                          Details
                        </DetailsButton>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </ContentBox>
    </DashboardContainer>
  );
}