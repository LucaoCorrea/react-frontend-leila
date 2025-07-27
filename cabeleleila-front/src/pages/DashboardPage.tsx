import styled from "styled-components";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
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
import { Person, CalendarToday, Info } from "@mui/icons-material";

const DashboardContainer = styled(Container)`
  background: white;
  padding: 2rem;
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const HeaderBox = styled(Box)`
  background: #ede7f6;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const ContentBox = styled(Box)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(63, 81, 181, 0.2);
  }
`;

const DetailsButton = styled(Box)`
  color: #3f51b5;
  font-weight: 600;
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const statusColors = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  REQUESTED: "primary",
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response =
        user.role === "ADMIN"
          ? await api.get("/bookings")
          : await api.get(`/bookings/client/${user.id}`);

      setBookings(response.data);
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
      </HeaderBox>

      <ContentBox>
        {user?.role === "USER" && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#3f51b5"
            >
              Seus Agendamentos
            </Typography>
            {bookings.length === 0 ? (
              <Typography>Nenhum agendamento encontrado.</Typography>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
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
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                          >
                            <Info fontSize="small" /> Detalhes
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
              Todos os Agendamentos
            </Typography>
            {bookings.length === 0 ? (
              <Typography>Nenhum agendamento encontrado.</Typography>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
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
                              {booking.client?.name || "Sem nome"}
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
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={1}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Criado por:{" "}
                              <strong>{booking.client?.email}</strong>
                            </Typography>
                          </Box>
                        </Box>

                        <Chip
                          label={booking.status}
                          color={statusColors[booking.status] || "default"}
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            minWidth: 100,
                          }}
                        />

                        <DetailsButton
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                        >
                          <Info fontSize="small" /> 
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
