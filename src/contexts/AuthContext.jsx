import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';
import databaseData from '../data/database.json';

// Mapeo de roles del backend a permisos del frontend
const ROLE_PERMISSIONS = {
  ADMIN: ['ventas', 'compras', 'productos', 'descuentos', 'inventario', 'agregar-stock', 'reportes', 'usuarios', 'caja-chica'],
  CAJA: ['ventas', 'caja-chica'],
  ALMACEN: ['productos', 'descuentos', 'inventario', 'agregar-stock'],
  // Soporte para roles antiguos (modo LOCAL)
  admin: ['ventas', 'compras', 'productos', 'descuentos', 'inventario', 'agregar-stock', 'reportes', 'usuarios', 'caja-chica'],
  cajero: ['ventas', 'caja-chica'],
  inventario: ['productos', 'descuentos', 'inventario', 'agregar-stock']
};

// Mapeo de roles del backend a roles del frontend (para navegación)
const ROLE_MAP_TO_FRONTEND = {
  ADMIN: 'admin',
  CAJA: 'cajero',
  ALMACEN: 'inventario'
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Obtener usuarios de la base de datos (solo para modo LOCAL)
  const getUsuariosWithRoles = () => {
    return databaseData.usuario
      .filter(u => u.habilitado)
      .map(usuario => {
        const rol = databaseData.rol.find(r => r.id_rol === usuario.id_rol);
        return {
          id: `USER${String(usuario.id_usuario).padStart(3, '0')}`,
          id_usuario: usuario.id_usuario,
          username: usuario.usuario,
          password: usuario.contrasenia,
          name: usuario.nombre,
          role: rol?.descripcion || 'sin_rol',
          permissions: ROLE_PERMISSIONS[rol?.descripcion] || [],
          habilitado: usuario.habilitado,
          reset: usuario.reset
        };
      });
  };

  // Transformar payload JWT a formato de usuario compatible
  const transformJwtToUser = (jwtPayload) => {
    const frontendRole = ROLE_MAP_TO_FRONTEND[jwtPayload.rol] || 'cajero';
    
    return {
      id: `USER${String(jwtPayload.idUsuario).padStart(3, '0')}`,
      id_usuario: jwtPayload.idUsuario,
      username: jwtPayload.sub,
      name: jwtPayload.nombre,
      role: frontendRole,
      backendRole: jwtPayload.rol, // Guardar rol del backend también
      permissions: ROLE_PERMISSIONS[jwtPayload.rol] || [],
      habilitado: jwtPayload.habilitado,
      reset: false // JWT no tiene reset
    };
  };

  const login = async (credentials) => {
    const { id, password } = credentials;
    
    try {
      // Usar authService para login (automático según modo)
      await authService.login(id, password);
      
      // Obtener información del usuario del token
      const userInfo = authService.getUserInfo();
      
      if (!userInfo) {
        return { success: false, message: 'Error al obtener información del usuario' };
      }
      
      // Transformar a formato compatible
      const transformedUser = transformJwtToUser(userInfo);
      
      setUser(transformedUser);
      setIsAuthenticated(true);
      
      // Guardar en localStorage (compatibilidad)
      localStorage.setItem('currentUser', JSON.stringify(transformedUser));
      
      return { success: true, user: transformedUser };
      
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.message || 'Credenciales incorrectas' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const checkStoredUser = () => {
    // Verificar si hay sesión activa con JWT
    if (authService.isAuthenticated()) {
      const userInfo = authService.getUserInfo();
      
      if (userInfo) {
        const transformedUser = transformJwtToUser(userInfo);
        setUser(transformedUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(transformedUser));
        return transformedUser;
      }
    }
    
    // Limpiar si no hay sesión válida
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    return null;
  };

  // Inicializar usuario desde JWT
  React.useEffect(() => {
    checkStoredUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    users: getUsuariosWithRoles(),
    roles: databaseData.rol,
    checkStoredUser,
    // Exponer authService para funciones avanzadas
    authService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
