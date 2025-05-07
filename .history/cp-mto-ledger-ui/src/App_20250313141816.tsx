import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Box from '@mui/material/Box';
import HomePage from './Components/HomePage';




const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Create a component to use useLocation
  const AppRoutes = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
      <Box sx={{ display: 'flex' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage/>}/>
          {/* Add other routes here */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    );
  };

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
