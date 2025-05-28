import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, Switch, FormControlLabel
} from "@mui/material";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "../../api/driverService";
import { Driver } from "../../types/driver";

const defaultForm: Omit<Driver, 'id'> = {
  name: "",
  license_number: "",
  license_type: "",
  phone: "",
  experience: 0,
  is_active: true,
  is_availible: true,
  birth_date: "",
  hire_date: ""
};

const DriversPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<Omit<Driver, 'id'>>(defaultForm);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
  const data = await getDrivers();
  setDrivers(data.results); // Беремо тільки масив водіїв
};

  const handleSubmit = async () => {
    try {
      if (editingDriver) {
        await updateDriver(editingDriver.id, formData);
        showSnackbar("Водія оновлено", "success");
      } else {
        await createDriver(formData);
        showSnackbar("Водія додано", "success");
      }
      fetchDrivers();
      handleCloseDialog();
    } catch {
      showSnackbar("Помилка збереження", "error");
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({ ...driver });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    await deleteDriver(id);
    fetchDrivers();
    showSnackbar("Водія видалено", "success");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDriver(null);
    setFormData(defaultForm);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div>
      <Button onClick={() => setOpenDialog(true)}>Додати водія</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ім'я</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Ліцензія</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map(driver => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.license_number} ({driver.license_type})</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(driver)}>Редагувати</Button>
                  <Button onClick={() => handleDelete(driver.id)}>Видалити</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingDriver ? "Редагувати" : "Додати"} водія</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Ім'я" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField fullWidth label="Телефон" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <TextField fullWidth label="Номер ліцензії" value={formData.license_number} onChange={(e) => setFormData({ ...formData, license_number: e.target.value })} />
          <TextField fullWidth label="Тип ліцензії" value={formData.license_type} onChange={(e) => setFormData({ ...formData, license_type: e.target.value })} />
          <TextField fullWidth label="Стаж (років)" type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })} />
          <TextField fullWidth type="date" label="Дата народження" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth type="date" label="Дата прийому" value={formData.hire_date} onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} InputLabelProps={{ shrink: true }} />
          <FormControlLabel control={<Switch checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />} label="Активний" />
          <FormControlLabel control={<Switch checked={formData.is_availible} onChange={(e) => setFormData({ ...formData, is_availible: e.target.checked })} />} label="Доступний" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Скасувати</Button>
          <Button onClick={handleSubmit}>Зберегти</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default DriversPage;