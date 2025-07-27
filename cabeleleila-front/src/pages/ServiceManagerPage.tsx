import { useEffect, useState } from "react";
import {
  Box, Button, Container, Typography, TextField, List, ListItem,
  ListItemText, IconButton
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function ServiceManagerPage() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    const res = await api.get("/services");
    setServices(res.data);
  };

  const handleSubmit = async () => {
    if (editingId) {
      await api.post("/services", { id: editingId, name, price });
      setEditingId(null);
    } else {
      await api.post("/services", { name, price });
    }
    setName("");
    setPrice("");
    fetchServices();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/services/${id}`);
    fetchServices();
  };

  const handleEdit = (service: any) => {
    setName(service.name);
    setPrice(service.price);
    setEditingId(service.id);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (user?.role !== "ADMIN") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" mt={4} color="error">
          Acesso negado. Apenas administradores podem acessar esta página.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3} color="primary.main">
        Gerenciar Serviços
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <TextField
          label="Nome do Serviço"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <TextField
          label="Preço"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          {editingId ? "Atualizar" : "Adicionar"}
        </Button>
      </Box>

      <List>
        {services.map((s: any) => (
          <ListItem
            key={s.id}
            secondaryAction={
              <>
                <IconButton onClick={() => handleEdit(s)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(s.id)} color="error">
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`${s.name}`}
              secondary={`R$ ${parseFloat(s.price).toFixed(2)}`}
              sx={{
                color: 'text.primary',
                fontWeight: 500,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
