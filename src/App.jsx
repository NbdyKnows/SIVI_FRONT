import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Ventas from './pages/Ventas';
import Compras from './pages/Compras';
import Productos from './pages/Productos';
import Descuentos from './pages/Descuentos';
import Inventario from './pages/Inventario';
import AgregarStock from './pages/AgregarStock';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import CajaChica from './pages/CajaChica';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta de Login */}
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          {/* Rutas protegidas con Layout */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="ventas" replace />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="caja-chica" element={<CajaChica />} />
            <Route path="compras" element={<Compras />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/descuentos" element={<Descuentos />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="inventario/agregar-stock" element={<AgregarStock />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;