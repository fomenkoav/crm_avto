export interface Client {  // Додайте `export`
  id: number;
  name: string;
  // ... інші поля
}

export interface Driver {  // Приклад іншого інтерфейсу
  id: number;
  // ...
}

// Або в кінці файлу, якщо він порожній:
export {};