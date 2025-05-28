import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getClients,
  createClient,
  updateClient,
  updateClientLicense,
  deleteClient,
} from '../../api/clientService';
import { Client } from '../../types/client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, MenuItem, Select, FormControl, InputLabel,
  Checkbox, FormControlLabel, Switch, Snackbar, Alert, CircularProgress, Box
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const licenseTypes = [
  { value: 'Passport', label: 'Паспорт' },
  { value: 'Driver license', label: 'Посвідчення водія' },
  { value: 'Car license', label: 'Паспорт на авто' },
];

const ClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'registration_date'>>({
    name: '',
    phone: '',
    email: '',
    preferences: {},
    is_active: true,
    license_number: '',
    license_type: 'Passport'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchClients();
    }
  }, [navigate]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/clients/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Виправлено: беремо дані з поля 'results' відповіді
      setClients(data.results || []);

    } catch (error) {
      console.error('Помилка завантаження клієнтів:', error);
      setError('Не вдалося завантажити клієнтів');
      setSnackbar({
        open: true,
        message: 'Помилка завантаження клієнтів',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    try {
      if (editingClient) {
        if (formData.license_type !== editingClient.license_type ||
            formData.license_number !== editingClient.license_number) {
          await updateClientLicense(editingClient.id, {
            license_type: formData.license_type,
            license_number: formData.license_number
          });
        }
        await updateClient(editingClient.id, formData);
        showSnackbar('Клієнта успішно оновлено', 'success');
      } else {
        await createClient(formData);
        showSnackbar('Клієнта успішно додано', 'success');
      }
      await fetchClients();
      handleCloseDialog();
    } catch (error) {
      console.error('Помилка при збереженні клієнта:', error);
      showSnackbar('Помилка при збереженні клієнта', 'error');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email,
      preferences: client.preferences,
      is_active: client.is_active,
      license_number: client.license_number,
      license_type: client.license_type
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      showSnackbar('Клієнта успішно видалено', 'success');
      await fetchClients();
    } catch (error) {
      console.error('Помилка при видаленні клієнта:', error);
      showSnackbar('Помилка при видаленні клієнта', 'error');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClient(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      preferences: {},
      is_active: true,
      license_number: '',
      license_type: 'Passport'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Додати клієнта
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ім'я</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Документ</TableCell>
              <TableCell>Номер документу</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.email || '-'}</TableCell>
                <TableCell>
                  {licenseTypes.find(t => t.value === client.license_type)?.label}
                </TableCell>
                <TableCell>{client.license_number}</TableCell>
                <TableCell>
                  <Switch
                    checked={client.is_active}
                    onChange={() => handleEdit({ ...client, is_active: !client.is_active })}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(client)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={async () => {
                    try {
                      await deleteClient(client.id);
                      await fetchClients();
                    } catch (error) {
                      console.error('Помилка видалення клієнта:', error);
                      showSnackbar('Помилка видалення клієнта', 'error');
                    }
                  }}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingClient ? 'Редагувати клієнта' : 'Додати нового клієнта'}</DialogTitle>
        <DialogContent>
          <TextField
            autoComplete="username"
            margin="dense"
            label="Ім'я"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Телефон"
            fullWidth
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            helperText="Формат: +380123456789"
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value || null })}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Тип документу</InputLabel>
            <Select
              value={formData.license_type}
              label="Тип документу"
              onChange={(e) => setFormData({ ...formData, license_type: e.target.value as any })}
            >
              {licenseTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Номер документу"
            fullWidth
            required
            value={formData.license_number}
            onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
            }
            label="Активний клієнт"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Скасувати</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingClient ? 'Оновити' : 'Додати'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({...prev, open: false}))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClientPage;
