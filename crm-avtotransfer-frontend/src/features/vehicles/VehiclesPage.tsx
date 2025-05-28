import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../api/vehicleService';
import { Vehicle, VehicleStatus, FuelType, VehicleType } from '../../types/vehicle';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, MenuItem, Select, FormControl, InputLabel,
  Checkbox, FormControlLabel, Switch, Snackbar, Alert, CircularProgress, Box
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { AxiosError } from 'axios';

const statusOptions: { value: VehicleStatus, label: string }[] = [
  { value: 'available', label: 'Доступний' },
  { value: 'in_use', label: 'У використанні' },
  { value: 'maintenance', label: 'На обслуговуванні' }
];

const fuelTypes: { value: FuelType, label: string }[] = [
  { value: 'diesel', label: 'Дизель' },
  { value: 'petrol', label: 'Бензин' },
  { value: 'electric', label: 'Електро' },
  { value: 'hybrid', label: 'Гібрид' }
];

const vehicleTypes: { value: VehicleType, label: string }[] = [
  { value: 'sedan', label: 'Седан' },
  { value: 'suv', label: 'Позашляховик' },
  { value: 'minivan', label: 'Мінівен' },
  { value: 'bus', label: 'Автобус' }
];

const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehiclesData, setVehiclesData] = useState<{results: Vehicle[]}>({results: []});
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    make: '',
    model: '',
    license_plate: '',
    vehicle_type: 'sedan',
    vehicle_type_display: 'Седан',
    year: new Date().getFullYear(),
    fuel_type: 'diesel',
    fuel_type_display: 'Дизель',
    mileage: 0,
    is_available: true,
    last_maintenance: new Date().toISOString().split('T')[0],
    purchase_price: 0,
    purchase_date: new Date().toISOString().split('T')[0],// Виправлено тип на string
    capacity: 4
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehiclesData(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Помилка:', axiosError);
      if (axiosError.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Не вдалося завантажити дані про транспорт');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData);
        showSnackbar('Транспорт оновлено', 'success');
      } else {
        await createVehicle(formData);
        showSnackbar('Транспорт додано', 'success');
      }
      await fetchVehicles();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Помилка при збереженні', 'error');
      console.error(error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVehicle(null);
    setFormData({
      make: '',
      model: '',
      license_plate: '',
      vehicle_type: 'sedan',
      vehicle_type_display: 'Седан',
      year: new Date().getFullYear(),
      fuel_type: 'diesel',
      fuel_type_display: 'Дизель',
      mileage: 0,
      is_available: true,
      last_maintenance: new Date().toISOString().split('T')[0],
      purchase_price: 0,
      purchase_date: new Date().toISOString().split('T')[0],
      capacity: 4
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      license_plate: vehicle.license_plate,
      vehicle_type: vehicle.vehicle_type,
      vehicle_type_display: vehicle.vehicle_type_display,
      year: vehicle.year,
      fuel_type: vehicle.fuel_type,
      fuel_type_display: vehicle.fuel_type_display,
      mileage: vehicle.mileage,
      is_available: vehicle.is_available,
      last_maintenance: vehicle.last_maintenance,
      purchase_price: vehicle.purchase_price,
      purchase_date: vehicle.purchase_date,
      capacity: vehicle.capacity
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVehicle(id);
      showSnackbar('Транспорт успішно видалено', 'success');
      await fetchVehicles();
    } catch (error) {
      showSnackbar('Помилка при видаленні транспорту', 'error');
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Додати транспорт
      </Button>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Марка</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell>Номерний знак</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Рік</TableCell>
                <TableCell>Кількість місць</TableCell>
                <TableCell>Пробіг</TableCell>
                <TableCell>Доступність</TableCell>
                <TableCell>Останнє ТО</TableCell>
                <TableCell>Вартість</TableCell>
                <TableCell>Дата придбання</TableCell>
                <TableCell>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehiclesData.results.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.license_plate}</TableCell>
                  <TableCell>{vehicle.vehicle_type_display}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.mileage}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={vehicle.is_available}
                      disabled
                      color={vehicle.is_available ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{vehicle.last_maintenance}</TableCell>
                  <TableCell>{vehicle.purchase_price}</TableCell>
                  <TableCell>{vehicle.purchase_date}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(vehicle)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(vehicle.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingVehicle ? 'Редагувати транспорт' : 'Додати новий транспорт'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              label="Марка"
              value={formData.make}
              onChange={(e) => setFormData({...formData, make: e.target.value})}
              required
            />
            <TextField
              label="Модель"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              required
            />
            <TextField
              label="Номерний знак"
              value={formData.license_plate}
              onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
              required
            />
            <FormControl>
              <InputLabel>Тип транспорту</InputLabel>
              <Select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({...formData, vehicle_type: e.target.value as VehicleType})}
                label="Тип транспорту"
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Рік"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || 0})}
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />
            <TextField
              label="Кількість місць"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
              required
            />
            <FormControl>
              <InputLabel>Тип палива</InputLabel>
              <Select
                value={formData.fuel_type}
                onChange={(e) => setFormData({...formData, fuel_type: e.target.value as FuelType})}
                label="Тип палива"
              >
                {fuelTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Пробіг"
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value) || 0})}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Останнє ТО"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.last_maintenance}
              onChange={(e) => setFormData({...formData, last_maintenance: e.target.value})}
            />
            <TextField
              label="Вартість придбання"
              type="number"
              value={formData.purchase_price}
              onChange={(e) => setFormData({...formData, purchase_price: Number(e.target.value)})}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Дата придбання"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.purchase_date}
              onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_available}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                />
              }
              label="Доступний"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Скасувати</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editingVehicle ? 'Зберегти зміни' : 'Додати'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VehiclesPage;