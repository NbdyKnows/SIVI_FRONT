import React, { createContext, useContext, useState } from 'react';
import databaseData from '../data/database.json';

// Mapeo de roles a permisos
const ROLE_PERMISSIONS = {
  admin: ['ventas', 'compras', 'productos', 'descuentos', 'inventario', 'agregar-stock', 'reportes', 'usuarios', 'caja-chica'],
  cajero: ['ventas', 'caja-chica'],
  inventario: ['productos', 'descuentos', 'inventario', 'agregar-stock']
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

  // Obtener usuarios de la base de datos
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

  const login = (credentials) => {
    const { id, password } = credentials;
    const usuarios = getUsuariosWithRoles();
    
    // Buscar usuario por ID o username
    const foundUser = usuarios.find(u => 
      (u.id.toLowerCase() === id.toLowerCase()) || 
      (u.username.toLowerCase() === id.toLowerCase())
    );

    if (foundUser && foundUser.password === password && foundUser.habilitado) {
      setUser(foundUser);
      setIsAuthenticated(true);
      
      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      
      return { success: true, user: foundUser };
    }
    
    return { success: false, message: 'Credenciales incorrectas' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const checkStoredUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        return parsedUser;
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    return null;
  };

  // Inicializar usuario desde localStorage
  React.useEffect(() => {
    checkStoredUser();
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    users: getUsuariosWithRoles(),
    roles: databaseData.rol,
    checkStoredUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;