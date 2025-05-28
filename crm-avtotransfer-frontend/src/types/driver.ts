export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_type: string;
  phone: string;
  experience: number;
  is_active: boolean;
  is_availible: boolean;
  birth_date: string;   // ISO string
  hire_date: string;    // ISO string
}

