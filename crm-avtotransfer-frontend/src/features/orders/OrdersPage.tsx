// src/features/orders/OrdersPage.tsx

import React, { useEffect, useState } from 'react';
import {
  getOrders, createOrder, updateOrder, deleteOrder,
} from '../../api/orderService';
import { getClients } from '../../api/clientService';
import { getVehicles } from '../../api/vehicleService';
import { getDrivers } from '../../api/driverService';
import { Order } from '../../types/order';
import { Client } from '../../types/client';
import { Driver } from '../../types/driver';
import { Vehicle } from '../../types/vehicle';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TextField,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Snackbar, Alert, Select, InputLabel, FormControl,
} from '@mui/material';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'created_at' | 'updated_at'>>({
    pickup_address: '',
    destination: '',
    status: 'pending',
    payment_type: 'cash',
    price: 0,
    notes: '',
    client_id: 0,
    driver_id: 0,
    vechicle_id: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [snackbar, setSnackbar] = useState<{
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}>({ open: false, message: '', severity: 'success' });

  const [clients, setClients] = useState<Client[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);



  const fetchAll = async () => {
    const [orderData, clientData, driverData, vehicleData] = await Promise.all([
      getOrders(), getClients(), getDrivers(), getVehicles(),
    ]);
    setOrders(orderData);
    setClients(clientData);
    setDrivers(driverData.results);
    setVehicles(vehicleData.results);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    try {
      if (editingOrderId) {
        await updateOrder(editingOrderId, formData);
        setSnackbar({ open: true, message: 'Замовлення оновлено', severity: 'success' });
      } else {
        await createOrder(formData);
        setSnackbar({ open: true, message: 'Замовлення створено', severity: 'success' });
      }
      fetchAll();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Помилка збереження', severity: 'error' as 'success' | 'error'
 });
    }
  };

  const handleEdit = (order: Order) => {
    setFormData({ ...order });
    setEditingOrderId(order.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    await deleteOrder(id);
    setSnackbar({ open: true, message: 'Замовлення видалено', severity: 'success' });
    fetchAll();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrderId(null);
    setFormData({
      pickup_address: '',
      destination: '',
      status: 'pending',
      payment_type: 'cash',
      price: 0,
      notes: '',
      client_id: 0,
      driver_id: 0,
      vechicle_id: 0,
    });
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <div>
      <h2>Замовлення</h2>

      <FormControl style={{ marginRight: 16 }}>
        <InputLabel>Статус</InputLabel>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="">Усі</MenuItem>
          <MenuItem value="pending">Очікує</MenuItem>
          <MenuItem value="active">Активні</MenuItem>
          <MenuItem value="completed">Завершені</MenuItem>
          <MenuItem value="cancelled">Скасовані</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Додати замовлення
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Клієнт</TableCell>
            <TableCell>Водій</TableCell>
            <TableCell>Авто</TableCell>
            <TableCell>Звідки</TableCell>
            <TableCell>Куди</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Ціна</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{clients.find(c => c.id === order.client_id)?.name}</TableCell>
              <TableCell>{drivers.find(d => d.id === order.driver_id)?.name}</TableCell>

              <TableCell>{order.pickup_address}</TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(order)}>✏️</Button>
                <Button onClick={() => handleDelete(order.id)}>🗑️</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingOrderId ? 'Редагувати' : 'Нове'} замовлення</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Звідки" value={formData.pickup_address} onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })} />
          <TextField fullWidth label="Куди" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel>Клієнт</InputLabel>
            <Select value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: Number(e.target.value) })}>
              {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Водій</InputLabel>
            <Select value={formData.driver_id} onChange={(e) => setFormData({ ...formData, driver_id: Number(e.target.value) })}>
              {drivers.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Авто</InputLabel>

          </FormControl>
          <TextField fullWidth label="Ціна" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
          <TextField fullWidth label="Примітки" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Order['status'] })}>
              <MenuItem value="pending">Очікує</MenuItem>
              <MenuItem value="active">Активне</MenuItem>
              <MenuItem value="completed">Завершене</MenuItem>
              <MenuItem value="cancelled">Скасовано</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Оплата</InputLabel>
            <Select value={formData.payment_type} onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as Order['payment_type'] })}>
              <MenuItem value="cash">Готівка</MenuItem>
              <MenuItem value="card">Карта</MenuItem>
            </Select>
          </FormControl>
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

export default OrdersPage;