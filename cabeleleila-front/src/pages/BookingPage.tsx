import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import api from '../api';

export default function BookingPage() {
  type Service = { id: number; name: string; price: number };
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([{ id: 0, name: '', price: 0 }]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  // Simulação do ID do cliente (aqui seria retirado do contexto ou autenticação)
  const clientId = 1;  // Exemplo: ID do cliente logado, você pode pegar de um contexto ou da autenticação

  // Buscar os serviços do backend
  useEffect(() => {
    const fetchServices = async () => {
      const response = await api.get('/services');
      setServices(response.data);
    };
    
    fetchServices();
  }, []);

  const addService = () => {
    setSelectedServices([...selectedServices, { id: 0, name: '', price: 0 }]);
  };

  const handleChange = <K extends keyof Service>(i: number, field: K, value: Service[K]) => {
    const updated = [...selectedServices];
    updated[i][field] = value;
    setSelectedServices(updated);
  };

  const handleSubmit = async () => {
    // Certifique-se de passar o ID do cliente corretamente
    const bookingData = {
      scheduledDate,
      notes,
      status: 'REQUESTED',
      client: { id: clientId }, // Passando o ID do cliente para o backend
      services: selectedServices.map(service => ({ id: service.id, price: service.price })),
    };

    try {
      const response = await api.post('/bookings', bookingData);
      if (response.status === 200) {
        alert('Booking submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting booking', error);
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
        
        {/* Renderizar os campos de serviço */}
        {selectedServices.map((service, i) => (
          <Box key={i} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Service</InputLabel>
              <Select
                value={service.id}
                onChange={(e) => handleChange(i, 'id', e.target.value as number)}
              >
                {services.map((serviceOption) => (
                  <MenuItem key={serviceOption.id} value={serviceOption.id}>
                    {serviceOption.name} - ${serviceOption.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}

        <Button onClick={addService} sx={{ mt: 2 }}>Add Service</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2, ml: 2 }}>Submit Booking</Button>
      </Box>
    </Container>
  );
}
