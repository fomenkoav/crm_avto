import axios from 'axios';
import { Vehicle } from '../types/vehicle';

const API_BASE_URL = 'http://localhost:8000/api/fleet';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Додаємо інтерсептор для авторизації
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export interface VehiclesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Vehicle[];
}

export const getVehicles = async (): Promise<VehiclesResponse> => {
  const response = await api.get('/vehicles/');
  return response.data;
};

export const createVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  const response = await api.post('/vehicles/', vehicle);
  return response.data;
};

export const updateVehicle = async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await api.patch(`/vehicles/${id}/`, vehicle);
  return response.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await api.delete(`/vehicles/${id}/`);
};