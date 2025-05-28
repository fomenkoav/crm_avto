// src/components/Navigation.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as ClientsIcon,
  DirectionsCar as VehiclesIcon,
  Home as HomeIcon,
  LocalShipping as DriversIcon,
  Assignment as OrdersIcon,
  AccountCircle,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    handleMenuClose();
    navigate('/login');
  };

  const navItems = [
    { text: 'Головна', icon: <HomeIcon />, path: '/' },
    { text: 'Клієнти', icon: <ClientsIcon />, path: '/clients' },
    { text: 'Водії', icon: <DriversIcon />, path: '/drivers' },
    { text: 'Транспорт', icon: <VehiclesIcon />, path: '/vehicles' },
    { text: 'Замовлення', icon: <OrdersIcon />, path: '/orders' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Автотрансферна CRM
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  variant={location.pathname === item.path ? 'outlined' : 'text'}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          <IconButton color="inherit" onClick={handleMenuOpen} sx={{ ml: 2 }}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Вийти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
