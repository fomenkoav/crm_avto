export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  preferences: Record<string, any>;
  registration_date: string;
  is_active: boolean;
  license_number: string;
  license_type: 'Passport' | 'Driver license' | 'Car license';
}