import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SidebarNavigation from './Components/NavBar.tsx';
import HomePage from './Components/HomePage';

const theme = createTheme();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const AppRoutes = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <SidebarNavigation />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
