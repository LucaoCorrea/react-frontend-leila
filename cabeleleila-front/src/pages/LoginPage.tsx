import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await api.post('/auth/login', { email, password });
    login(res.data.token);
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h4">Login</Typography>
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Login</Button>
      </Box>
    </Container>
  );
}