import { jwtDecode } from 'jwt-decode';
import { AUTH_CONFIG } from '../config/appConfig';

/**
 * ⚠️ CONFIGURACIÓN CENTRALIZADA ⚠️
 * 
 * Este servicio ahora usa la configuración global de src/config/appConfig.js
 * 
 * Para cambiar el modo (LOCAL, DEVELOPMENT, PRODUCTION):
 * 👉 Edita la constante APP_MODE en: src/config/appConfig.js
 * 
 * Ya NO necesitas cambiar nada en este archivo.
 */

/**
 * Servicio de Autenticación
 */
class AuthService {
  
  /**
   * Realizar login
   */
  async login(usuario, contrasenia) {
    // Modo LOCAL: Autenticación con JSON
    if (AUTH_CONFIG.useLocalAuth) {
      return this.loginLocal(usuario, contrasenia);
    }
    
    // Modo DEVELOPMENT o PRODUCTION: Autenticación con backend
    return this.loginBackend(usuario, contrasenia);
  }
  
  /**
   * Login con base de datos local (JSON)
   */
  async loginLocal(username, password) {
    // Obtener usuarios del localStorage
    const dbString = localStorage.getItem('minimarket_db');
    if (!dbString) {
      throw new Error('Base de datos no inicializada');
    }
    
    const db = JSON.parse(dbString);
    const user = db.usuarios?.find(
      (u) => u.username === username && u.password === password && u.active
    );
    
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    
    // Crear un token falso para modo local (solo para mantener consistencia)
    const fakePayload = {
      sub: user.username,
      idUsuario: parseInt(user.id.replace('USER', '')),
      nombre: user.name,
      rol: this.mapRoleToBackend(user.role),
      idRol: this.getRoleId(user.role),
      habilitado: user.active,
      iss: 'SIVI',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
    };
    
    // En modo local, guardamos directamente el payload
    localStorage.setItem('auth_user', JSON.stringify(fakePayload));
    localStorage.setItem('auth_mode', 'LOCAL');
    
    return {
      accessToken: 'local_token',
      refreshToken: 'local_refresh',
      expiresIn: 86400,
    };
  }
  
  /**
   * Login con backend (JWT real)
   */
  async loginBackend(usuario, contrasenia) {
    const apiUrl = AUTH_CONFIG.apiUrl;
    
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasenia }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }
      
      const data = await response.json();
      const { accessToken, refreshToken } = data;
      
      // Guardar tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('auth_mode', AUTH_CONFIG.mode);
      
      return data;
      
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error de conexión con el servidor');
    }
  }
  
  /**
   * Obtener información del usuario
   */
  getUserInfo() {
    const mode = localStorage.getItem('auth_mode');
    
    // Modo LOCAL
    if (mode === 'LOCAL') {
      const userString = localStorage.getItem('auth_user');
      if (!userString) return null;
      
      try {
        return JSON.parse(userString);
      } catch {
        return null;
      }
    }
    
    // Modo BACKEND
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }
  
  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    const mode = localStorage.getItem('auth_mode');
    
    // Modo LOCAL
    if (mode === 'LOCAL') {
      const userString = localStorage.getItem('auth_user');
      if (!userString) return false;
      
      try {
        const user = JSON.parse(userString);
        const currentTime = Date.now() / 1000;
        return user.exp > currentTime;
      } catch {
        return false;
      }
    }
    
    // Modo BACKEND
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }
  
  /**
   * Obtener el access token
   */
  getAccessToken() {
    const mode = localStorage.getItem('auth_mode');
    
    if (mode === 'LOCAL') {
      return 'local_token'; // Token falso para modo local
    }
    
    return localStorage.getItem('accessToken');
  }
  
  /**
   * Renovar el access token usando refresh token
   */
  async refreshToken() {
    const mode = localStorage.getItem('auth_mode');
    
    // En modo LOCAL no hay refresh
    if (mode === 'LOCAL') {
      throw new Error('Refresh token no disponible en modo local');
    }
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const apiUrl = AUTH_CONFIG.apiUrl;
    
    try {
      const response = await fetch(`${apiUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      const { accessToken } = data;
      
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_mode');
    
    // También limpiamos el usuario del AuthContext anterior
    localStorage.removeItem('minimarket_user');
  }
  
  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role) {
    const userInfo = this.getUserInfo();
    return userInfo?.rol === role;
  }
  
  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles) {
    const userInfo = this.getUserInfo();
    return userInfo ? roles.includes(userInfo.rol) : false;
  }
  
  /**
   * Obtener el modo de autenticación actual
   */
  getAuthMode() {
    return AUTH_CONFIG.mode;
  }
  
  /**
   * Mapear roles del frontend al formato del backend
   */
  mapRoleToBackend(frontendRole) {
    const roleMap = {
      'admin': 'ADMIN',
      'vendedor': 'CAJA',
      'encargado_inventario': 'ALMACEN',
      'contador': 'ADMIN', // Contador también tiene permisos de admin
    };
    
    return roleMap[frontendRole] || 'CAJA';
  }
  
  /**
   * Obtener ID de rol
   */
  getRoleId(frontendRole) {
    const roleIdMap = {
      'admin': 1,
      'vendedor': 2,
      'encargado_inventario': 3,
      'contador': 1,
    };
    
    return roleIdMap[frontendRole] || 2;
  }
}

// Exportar instancia única
const authService = new AuthService();
export default authService;
