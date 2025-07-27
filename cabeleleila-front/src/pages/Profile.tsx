import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { styled } from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Container = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const FormWrapper = styled(Paper)`
  padding: 32px;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 16px;
`;

const StyledTextField = styled(TextField)`
  && {
    width: 100%;
  }
`;

const PurpleButton = styled(Button)`
  && {
    background-color: #3f51b5;
    color: white;
    font-weight: 600;
    text-transform: none;
    &:hover {
      background-color: #303f9f;
    }
  }
`;

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      await axios.post(
        "http://localhost:8080/auth/update",
        {
          name,
          email,
          password: password || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper elevation={3}>
        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          color="#3f51b5"
        >
          Editar Perfil
        </Typography>

        <StyledTextField
          label="Nome"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <StyledTextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledTextField
          label="Nova Senha"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PurpleButton
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Salvar Alterações"
          )}
        </PurpleButton>

        {success && (
          <Typography variant="body2" color="green" textAlign="center">
            Perfil atualizado com sucesso.
          </Typography>
        )}
      </FormWrapper>
    </Container>
  );
}
