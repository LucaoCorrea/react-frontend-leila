import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5">Welcome, {user?.name || 'User'}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/book')}>Book Appointment</Button>
        <Button color="error" sx={{ mt: 2, ml: 2 }} onClick={logout}>Logout</Button>
      </Box>
    </Container>
  );
}