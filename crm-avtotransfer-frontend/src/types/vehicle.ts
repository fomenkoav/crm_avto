export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';
export type VehicleType = 'sedan' | 'suv' | 'minivan' | 'bus';
export type FuelType = 'diesel' | 'petrol' | 'electric' | 'hybrid';


export interface Vehicle {
  id: number;
  make: string;
  model: string;
  license_plate: string;
  vehicle_type: VehicleType;
  vehicle_type_display: string;
  year: number;
  fuel_type: FuelType;
  fuel_type_display: string;
  mileage: number;
  is_available: boolean;
  last_maintenance: string;
  purchase_date: string;
  purchase_price: number;
  capacity: number;

}