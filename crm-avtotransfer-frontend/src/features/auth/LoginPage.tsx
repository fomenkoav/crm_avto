import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Alert } from '@mui/material';
import { login } from '../../api/authService';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const token = await login(credentials);
        // Змініть на 'token' для консистентності
        localStorage.setItem('token', token);
        console.log('Токен збережено:', token);
        navigate('/clients');
      } catch (err) {
        setError('Невірні облікові дані');
      }
};

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        autoComplete="username"
        label="Username"
        fullWidth
        margin="normal"
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        fullWidth
        margin="normal"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
export {}; // Для вирішення проблеми ізольованих модулів