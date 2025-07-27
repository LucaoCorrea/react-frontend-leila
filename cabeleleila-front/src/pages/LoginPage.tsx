import { useState } from "react";
import styled from "styled-components";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
`;

const LoginBox = styled(Box)`
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0px 30px 50px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled(Typography)`
  margin-bottom: 2rem !important;
  color: #3f51b5;
  font-weight: 700 !important;
`;

const LoginButton = styled(Button)`
  background: linear-gradient(45deg, #3f51b5 0%, #6573c3 100%) !important;
  padding: 12px 0 !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  margin-top: 1.5rem !important;
  text-transform: none !important;
  font-size: 1rem !important;
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      login(token);
      navigate("/dashboard");
    } catch (error) {
      setError("Falha ao realizar login. Verifique suas credenciais.");
      console.error("Login failed:", error);
    }
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginBox>
        <LoginTitle variant="h4">Bem-vindo de volta</LoginTitle>
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
        <LoginButton fullWidth variant="contained" onClick={handleSubmit}>
          Entrar
        </LoginButton>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Ainda não tem uma conta?{" "}
          <a
            href="/register"
            style={{ color: "#3f51b5", textDecoration: "none" }}
          >
            Registre-se
          </a>
        </Typography>
      </LoginBox>
    </LoginContainer>
  );
}

