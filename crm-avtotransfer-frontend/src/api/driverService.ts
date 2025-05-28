import axios from "axios";
import { Driver } from "../types/driver";

const API_URL = "http://127.0.0.1:8000/api/drivers/drivers/";

const getToken = () => localStorage.getItem("token");

export const getDrivers = async (): Promise<Driver[]> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  return response.data;
};

export const createDriver = async (driverData: Omit<Driver, "id">): Promise<Driver> => {
  const response = await axios.post(API_URL, driverData, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  return response.data;
};

export const updateDriver = async (id: number, driverData: Omit<Driver, "id">): Promise<Driver> => {
  const response = await axios.put(`${API_URL}${id}/`, driverData, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  return response.data;
};

export const deleteDriver = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Token ${getToken()}` },
  });
};
