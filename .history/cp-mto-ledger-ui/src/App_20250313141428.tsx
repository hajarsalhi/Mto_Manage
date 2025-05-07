import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Box from '@mui/material/Box';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const username = "John Doe";

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: 0,
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        }}
      >
        {children}
      </Box>
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
        <SidebarNavigation />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
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
