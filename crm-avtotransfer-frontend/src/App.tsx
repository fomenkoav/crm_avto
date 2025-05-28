import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/Navigation';
import HomePage from './features/home/HomePage';
import ClientsPage from './features/clients/ClientsPage';
import VehiclesPage from './features/vehicles/VehiclesPage';

// Створюємо тему для Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Нормалізація стилів */}
      <Router> {/* Обгортка для маршрутизації */}
        <Navigation /> {/* Навігаційна панель */}
        <Routes> {/* Контейнер для маршрутів */}
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; // Експорт головного компонента