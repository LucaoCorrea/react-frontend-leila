import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  Business,
  People,
  Settings,
  Logout,
  Notifications,
  Report,
  BookOnline,
  Menu as MenuIcon,
  CalendarMonth,
} from "@mui/icons-material";

const StyledAppBar = styled(AppBar)`
  background: white !important;
  color: #3f51b5 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
`;

const NavTitle = styled(Typography)`
  && {
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    color: #3f51b5;
  }
`;

const NavActions = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationBadge = styled(Badge)`
  & .MuiBadge-badge {
    right: -3px;
    top: 13px;
    border: 2px solid #fff;
    padding: 0 4px;
  }
`;

const UserMenu = styled(Menu)`
  & .MuiPaper-root {
    min-width: 200px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    margin-top: 8px;
  }
`;

const PurpleButton = styled(Button)`
  && {
    color: #3f51b5;
    font-weight: 600;
    text-transform: none;
    &:hover {
      background-color: rgba(63, 81, 181, 0.08);
    }
  }
`;

const PurpleIconButton = styled(IconButton)`
  && {
    color: #3f51b5;
  }
`;

const PurpleAvatar = styled(Avatar)`
  && {
    background-color: #ede7f6;
    color: #3f51b5;
    font-weight: bold;
  }
`;

const PurpleMenuItem = styled(MenuItem)`
  && {
    padding: 12px 20px;
    color: #3f51b5;
    font-weight: 500;
    & svg {
      margin-right: 12px;
      color: #3f51b5;
    }
    &:hover {
      background-color: rgba(103, 58, 183, 0.08);
    }
  }
`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const drawerLinks = (
    <List>
      <ListItem button onClick={() => handleNavigation("/dashboard")}>
        <Dashboard sx={{ mr: 1 }} /> <ListItemText primary="Dashboard" />
      </ListItem>

      {user?.role === "USER" && (
        <ListItem button onClick={() => handleNavigation("/book")}>
          <BookOnline sx={{ mr: 1 }} /> <ListItemText primary="Agendar" />
        </ListItem>
      )}

      <ListItem button onClick={() => handleNavigation("/calendar")}>
        <CalendarMonth sx={{ mr: 1 }} /> <ListItemText primary="Calendário" />
      </ListItem>

      {user?.role === "ADMIN" && (
        <>
          <ListItem button onClick={() => handleNavigation("/revenue")}>
            <Report sx={{ mr: 1 }} /> <ListItemText primary="Faturamento" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/services")}>
            <Settings sx={{ mr: 1 }} /> <ListItemText primary="Serviços" />
          </ListItem>
        </>
      )}

      <Divider />
      <ListItem button onClick={() => handleNavigation("/profile")}>
        <People sx={{ mr: 1 }} /> <ListItemText primary="Perfil" />
      </ListItem>
      <ListItem button onClick={() => handleNavigation("/settings")}>
        <Settings sx={{ mr: 1 }} /> <ListItemText primary="Configurações" />
      </ListItem>
      <Divider />
      <ListItem button onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} /> <ListItemText primary="Sair" />
      </ListItem>
    </List>
  );

  return (
    <>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          <Box display="flex" alignItems="center" gap={2}>
            <PurpleIconButton
              size="large"
              edge="start"
              onClick={() => navigate("/dashboard")}
            >
              <img src="../src/assets/logo.png" width={50} />
            </PurpleIconButton>
            <NavTitle variant="h6" onClick={() => navigate("/dashboard")}>
              Cabeleleila Leila
            </NavTitle>
          </Box>

          {user && (
            <>
              {isMobile ? (
                <Box>
                  <PurpleIconButton onClick={() => setDrawerOpen(true)}>
                    <MenuIcon />
                  </PurpleIconButton>
                </Box>
              ) : (
                <NavActions>
                  <PurpleButton
                    onClick={() => navigate("/dashboard")}
                    startIcon={<Dashboard />}
                  >
                    Dashboard
                  </PurpleButton>

                  {user.role === "USER" && (
                    <PurpleButton
                      onClick={() => navigate("/book")}
                      startIcon={<BookOnline />}
                    >
                      Agendar
                    </PurpleButton>
                  )}

                  <PurpleButton
                    onClick={() => navigate("/calendar")}
                    startIcon={<CalendarMonth />}
                  >
                    Calendário
                  </PurpleButton>

                  {user.role === "ADMIN" && (
                    <>
                      <PurpleButton
                        onClick={() => navigate("/revenue")}
                        startIcon={<Report />}
                      >
                        Faturamento
                      </PurpleButton>
                      <PurpleButton
                        onClick={() => navigate("/services")}
                        startIcon={<Settings />}
                      >
                        Serviços
                      </PurpleButton>
                    </>
                  )}

                  <PurpleIconButton onClick={handleMenuOpen}>
                    <PurpleAvatar>
                      {user.name?.charAt(0).toUpperCase()}
                    </PurpleAvatar>
                  </PurpleIconButton>
                </NavActions>
              )}
            </>
          )}

          <UserMenu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <Box px={2} py={1}>
              <Typography fontWeight="bold">
                {user?.name || "Usuário"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.role}
              </Typography>
            </Box>
            <Divider />
            <PurpleMenuItem onClick={() => handleNavigation("/profile")}>
              <ListItemIcon>
                <People fontSize="small" />
              </ListItemIcon>
              Perfil
            </PurpleMenuItem>
            <PurpleMenuItem onClick={() => handleNavigation("/settings")}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configurações
            </PurpleMenuItem>
            <Divider />
            <PurpleMenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sair
            </PurpleMenuItem>
          </UserMenu>
        </StyledToolbar>
      </StyledAppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          width={250}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          {drawerLinks}
        </Box>
      </Drawer>
    </>
  );
}
