import { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress,
  Radio,
} from "@mui/material";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

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

const RedButton = styled(Button)`
  && {
    background-color: #f44336;
    color: white;
    font-weight: 600;
    text-transform: none;
    &:hover {
      background-color: #d32f2f;
    }
  }
`;

export default function Settings() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [language, setLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await axios.delete(
        `http://localhost:8080/auth/delete/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Conta excluída:", response.data);
      logout(); // Limpa o usuário e token
      navigate("/login");
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
    } finally {
      setIsLoading(false);
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
          Configurações
        </Typography>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={toggleTheme} />}
          label="Modo Escuro"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={toggleNotifications}
            />
          }
          label="Notificações"
        />
        <Box>
          <Typography variant="body1" color="textSecondary">
            Idioma
          </Typography>
          <FormControlLabel
            control={
              <Radio
                checked={language === "en"}
                value="en"
                onChange={handleLanguageChange}
              />
            }
            label="Inglês"
          />
          <FormControlLabel
            control={
              <Radio
                checked={language === "pt"}
                value="pt"
                onChange={handleLanguageChange}
              />
            }
            label="Português"
          />
        </Box>

        <RedButton
          variant="contained"
          onClick={() => setDeleteConfirmation(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Excluir Conta"
          )}
        </RedButton>

        {deleteConfirmation && !isLoading && (
          <Box>
            <Typography variant="body2" color="error" textAlign="center">
              Tem certeza de que deseja excluir sua conta? Esta ação não pode
              ser desfeita.
            </Typography>
            <Box display="flex" justifyContent="space-around" gap={2}>
              <PurpleButton
                variant="outlined"
                onClick={() => setDeleteConfirmation(false)}
              >
                Cancelar
              </PurpleButton>
              <RedButton variant="contained" onClick={handleDeleteAccount}>
                Confirmar Exclusão
              </RedButton>
            </Box>
          </Box>
        )}
      </FormWrapper>
    </Container>
  );
}
