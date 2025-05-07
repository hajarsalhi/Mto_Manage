import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Box from '@mui/material/Box';
import SidebarNavigation from '../src/Components/NavBar.tsx';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const username = "John Doe";

  return (
    <>
      <SidebarNavigation />
    </>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <Layout>{children}</Layout>;
  };

  // Create a component to use useLocation
  const AppRoutes = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
      <Box sx={{ display: 'flex' }}>
        <Routes>
          {/* Redirect root path to login */}
          
          {/* Catch all route - redirect to login */}
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
