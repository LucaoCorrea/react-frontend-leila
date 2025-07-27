import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
} from '@mui/material';
import {
  Dashboard,
  Business,
  People,
  Settings,
  Logout,
  Notifications,
  Report,
  BookOnline
} from '@mui/icons-material';

// Componentes estilizados simplificados
const StyledAppBar = styled(AppBar)`
  background: linear-gradient(135deg, #3f51b5 0%, #6573c3 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
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
    border: 2px solid #fff; /* Cor fixa */
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

const MenuItemStyled = styled(MenuItem)`
  && {
    padding: 12px 20px;
    & svg {
      margin-right: 12px;
      color: rgba(0, 0, 0, 0.6); /* Cor fixa */
    }
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            <Business fontSize="large" />
          </IconButton>
          <NavTitle variant="h6" onClick={() => navigate('/dashboard')}>
            Booking System
          </NavTitle>
        </Box>

        {user && (
          <NavActions>
            {user.role === 'ADMIN' && (
              <>
                <Button 
                  color="inherit" 
                  startIcon={<Dashboard />}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Report />}
                  onClick={() => navigate('/admin/reports')}
                >
                  Reports
                </Button>
              </>
            )}

            {user.role === 'USER' && (
              <Button 
                color="inherit" 
                startIcon={<BookOnline />}
                onClick={() => navigate('/book')}
              >
                New Booking
              </Button>
            )}

            <IconButton size="large" color="inherit">
              <NotificationBadge badgeContent={4} color="error">
                <Notifications />
              </NotificationBadge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ bgcolor: 'white', color: '#3f51b5' }}>
                {user?.sub?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </NavActions>
        )}

        <UserMenu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <Box px={2} py={1}>
            <Typography fontWeight="bold">{user?.sub || 'User'}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.role}
            </Typography>
          </Box>
          <Divider />

          <MenuItemStyled onClick={() => handleNavigation('/profile')}>
            <ListItemIcon>
              <People fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItemStyled>

          <MenuItemStyled onClick={() => handleNavigation('/settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItemStyled>

          <Divider />

          <MenuItemStyled onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItemStyled>
        </UserMenu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;