import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        if (user.role === 'ADMIN') {
          const response = await api.get('/bookings');
          setBookings(response.data);
        } else if (user.role === 'USER') {
          const response = await api.get(`/bookings/client/${user.id}`);
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Box mt={4} display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5">Welcome, {user?.sub || 'User'}</Typography>

        {user?.role === 'USER' && (
          <>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/book')}>
              Book Appointment
            </Button>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Your Bookings:
            </Typography>
            {bookings.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {bookings.map((booking) => (
                  <Typography key={booking.id} sx={{ mb: 1 }}>
                    {booking.scheduledDate} - {booking.status}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography>No bookings found</Typography>
            )}
          </>
        )}

        {user?.role === 'ADMIN' && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              All Bookings:
            </Typography>
            {bookings.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {bookings.map((booking) => (
                  <Typography key={booking.id} sx={{ mb: 1 }}>
                    {booking.clientName} - {booking.scheduledDate} - {booking.status}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography>No bookings found</Typography>
            )}
          </>
        )}

        <Button color="error" sx={{ mt: 2, ml: 2 }} onClick={logout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}
