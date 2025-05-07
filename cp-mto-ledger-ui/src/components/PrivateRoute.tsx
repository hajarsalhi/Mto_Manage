import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service.ts';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if specific role is required
  if (requiredRole && !authService.hasRole(requiredRole)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has required role, render the protected component
  return <>{children}</>;
};

export default PrivateRoute; 