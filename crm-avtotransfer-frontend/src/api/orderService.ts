import axios from "axios";
import { Order } from "../types/order";

const API_URL = "http://127.0.0.1:8000/api/orders/orders/";
const getToken = () => localStorage.getItem("token");

export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  return response.data;
};

export const createOrder = async (orderData: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> => {
  const response = await axios.post(API_URL, orderData, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  return response.data;
};

export const updateOrder = async (id: number, orderData: Partial<Order>): Promise<Order> => {
  const response = await axios.put(`${API_URL}${id}/`, orderData, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Token ${getToken()}` },
  });
};
