import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      p: 3
    }}>
      <Typography variant="h3" gutterBottom>
        Ласкаво просимо до CRM автотрансферу
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Керуйте клієнтами, транспортним парком та замовленнями в одному місці
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/clients"
        >
          Клієнти
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/vehicles"
        >
          Транспорт
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;