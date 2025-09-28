import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Si ya está autenticado, redirigir a la aplicación
  if (isAuthenticated && user) {
    return <Navigate to="/app/ventas" replace />;
  }

  // Si no está autenticado, mostrar el contenido (login)
  return children;
};

export default PublicRoute;