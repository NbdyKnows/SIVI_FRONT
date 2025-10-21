/**
 * HTTP Client - Helper para peticiones HTTP
 * Este servicio usa la configuración global de src/config/appConfig.js
 * Servicio centralizado para realizar peticiones a la API con manejo de errores, timeouts, y transformación automática de respuestas.
 */

import { API_BASE_URL, API_TIMEOUT, ENV_INFO } from '../config/appConfig';

/**
 * Clase de error personalizada para la API
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Configuración por defecto para las peticiones
 */
const defaultConfig = {
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Helper para manejar timeouts
 */
const fetchWithTimeout = async (url, options = {}) => {
  const timeout = options.timeout || defaultConfig.timeout;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new APIError('Tiempo de espera agotado', 408, null);
    }
    throw error;
  }
};

/**
 * Procesar respuesta de la API
 */
const processResponse = async (response) => {
  // Si la respuesta no es exitosa (status 200-299)
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    throw new APIError(
      errorData?.message || `Error ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Intentar parsear como JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  // Si no es JSON, retornar como texto
  return await response.text();
};

/**
 * Obtener token de autenticación (si existe)
 */
const getAuthToken = () => {
  // En modo LOCAL, usar token local
  if (ENV_INFO.isLocal) {
    const user = localStorage.getItem('minimarket_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.token; // Token del modo local
      } catch {
        return null;
      }
    }
    return 'local_token'; // Token falso para modo local
  }
  
  // En modos DEVELOPMENT/PRODUCTION, usar accessToken del backend
  return localStorage.getItem('accessToken');
};

/**
 * HTTP Client - Métodos principales
 */
const httpClient = {
  /**
   * GET - Obtener datos
   */
  async get(url, options = {}) {
    const token = getAuthToken();
    const headers = {
      ...defaultConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers,
        ...options,
      });

      return await processResponse(response);
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  },

  /**
   * POST - Crear datos
   */
  async post(url, data, options = {}) {
    const token = getAuthToken();
    const headers = {
      ...defaultConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        ...options,
      });

      return await processResponse(response);
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  },

  /**
   * PUT - Actualizar datos
   */
  async put(url, data, options = {}) {
    const token = getAuthToken();
    const headers = {
      ...defaultConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetchWithTimeout(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        ...options,
      });

      return await processResponse(response);
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  },

  /**
   * PATCH - Actualizar parcialmente
   */
  async patch(url, data, options = {}) {
    const token = getAuthToken();
    const headers = {
      ...defaultConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetchWithTimeout(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
        ...options,
      });

      return await processResponse(response);
    } catch (error) {
      console.error('PATCH Error:', error);
      throw error;
    }
  },

  /**
   * DELETE - Eliminar datos
   */
  async delete(url, options = {}) {
    const token = getAuthToken();
    const headers = {
      ...defaultConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetchWithTimeout(url, {
        method: 'DELETE',
        headers,
        ...options,
      });

      return await processResponse(response);
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  },
};

export default httpClient;
