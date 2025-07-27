import { useState } from "react";
import styled from "styled-components";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

const RegisterContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
`;

const RegisterBox = styled(Box)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0px 30px 50px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const RegisterTitle = styled(Typography)`
  margin-bottom: 2rem !important;
  color: #3f51b5;
  font-weight: 700 !important;
`;

const RegisterButton = styled(Button)`
  background: linear-gradient(45deg, #3f51b5 0%, #6573c3 100%) !important;
  padding: 12px 0 !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  margin-top: 1.5rem !important;
  text-transform: none !important;
  font-size: 1rem !important;
`;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password, role });
      navigate("/login");
    } catch (error) {
      setError("Falha ao registrar. E-mail já existe.");
      console.error("Registration failed:", error);
    }
  };

  return (
    <RegisterContainer maxWidth={false}>
      <RegisterBox>
        <RegisterTitle variant="h4">Crie sua conta</RegisterTitle>
        <TextField
          fullWidth
          label="Nome completo"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          sx={{ mb: 1 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <RegisterButton fullWidth variant="contained" onClick={handleSubmit}>
          Registrar
        </RegisterButton>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Já tem uma conta?{" "}
          <a href="/login" style={{ color: "#3f51b5", textDecoration: "none" }}>
            Faça login
          </a>
        </Typography>
      </RegisterBox>
    </RegisterContainer>
  );
}
