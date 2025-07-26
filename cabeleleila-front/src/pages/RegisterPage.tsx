import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await api.post('/register', { name, email, password});
    navigate('/login');
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h4">Register</Typography>
        <TextField fullWidth label="Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Register</Button>
      </Box>
    </Container>
  );
}