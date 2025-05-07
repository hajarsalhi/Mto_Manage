import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const username = "John Doe";

  return (
    <>
      <SideNav 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        username={username} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: drawerOpen ? 0 : -35,
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        }}
      >
        <Navbar onMenuClick={() => setDrawerOpen(!drawerOpen)} />
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
