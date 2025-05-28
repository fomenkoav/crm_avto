import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Створюємо тему для Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Основний колір
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Нормалізація CSS */}
      <App />
    </ThemeProvider>
 // </React.StrictMode>
);

reportWebVitals();
