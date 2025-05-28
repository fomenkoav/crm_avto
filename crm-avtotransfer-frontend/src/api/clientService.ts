import apiClient from './client';
import { Client } from '../types/client';

// Базовий шлях для клієнтів
const CLIENT_BASE_PATH = '/clients';

export const getClients = async (): Promise<Client[]> => {
  const response = await apiClient.get(CLIENT_BASE_PATH + '/');
  return response.data;
};

export const getClientDetails = async (id: number): Promise<Client> => {
  const response = await apiClient.get(`${CLIENT_BASE_PATH}/${id}/`);
  return response.data;
};

export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await apiClient.get(CLIENT_BASE_PATH + `/?search=${query}`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id' | 'registration_date'>): Promise<Client> => {
  const response = await apiClient.post(CLIENT_BASE_PATH + '/', {
    ...client,
    is_active: true,
    preferences: client.preferences || {}
  });
  return response.data;
};

export const updateClient = async (id: number, client: Partial<Client>): Promise<Client> => {
  const response = await apiClient.patch(`${CLIENT_BASE_PATH}/${id}/`, client);
  return response.data;
};

export const updateClientLicense = async (id: number, licenseData: {license_type: string, license_number: string}): Promise<Client> => {
  const response = await apiClient.patch(`${CLIENT_BASE_PATH}/${id}/update-license/`, licenseData);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await apiClient.delete(`${CLIENT_BASE_PATH}/${id}/`);
};

export const getActiveClients = async (): Promise<Client[]> => {
  const response = await apiClient.get(CLIENT_BASE_PATH + '/active/');
  return response.data;
};