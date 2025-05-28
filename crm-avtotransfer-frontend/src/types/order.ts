export interface Order {
  id: number;
  pickup_address: string;
  destination: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  payment_type: 'card' | 'cash';
  price: number;
  created_at: string;
  updated_at: string;
  notes: string;
  client_id: number;
  driver_id: number;
  vechicle_id: number;
}

