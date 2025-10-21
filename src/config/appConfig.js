/**
 * CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
 * 
 * Cambia APP_MODE según tu entorno:
 * - 'LOCAL': Usa base de datos JSON (sin backend) - Solo localStorage
 * - 'DEVELOPMENT': Backend local en desarrollo (http://localhost:8083)
 * - 'PRODUCTION': Backend en producción desplegado
 */

// ===================================
// CAMBIA ESTE VALOR PARA CAMBIAR TODO
// ===================================
export const APP_MODE = 'LOCAL'; // 'LOCAL' | 'DEVELOPMENT' | 'PRODUCTION'

/**
 * URLs de la API según el modo
 */
const API_URLS = {
  LOCAL: null, // localStorage
  DEVELOPMENT: 'http://localhost:8083/api',
  PRODUCTION: import.meta.env.VITE_API_BASE_URL_PROD || 'https://api.minimarket-losrobles.com/api',
};

/**
 * Configuración de timeouts según el modo
 */
const TIMEOUTS = {
  LOCAL: 5000,        // 5 segundos (rápido, sin red)
  DEVELOPMENT: 10000, // 10 segundos
  PRODUCTION: 15000,  // 15 segundos
};

/**
 * URL base de la API según el modo actual
 */
export const API_BASE_URL = API_URLS[APP_MODE];

/**
 * Timeout de peticiones según el modo actual
 */
export const API_TIMEOUT = TIMEOUTS[APP_MODE];

/**
 * Información del modo actual
 */
export const ENV_INFO = {
  mode: APP_MODE,
  isLocal: APP_MODE === 'LOCAL',
  isDevelopment: APP_MODE === 'DEVELOPMENT',
  isProduction: APP_MODE === 'PRODUCTION',
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
};

/**
 * Configuración de autenticación según el modo
 */
export const AUTH_CONFIG = {
  mode: APP_MODE,
  apiUrl: APP_MODE === 'LOCAL' ? null : `${API_BASE_URL}/auth`,
  useLocalAuth: APP_MODE === 'LOCAL',
  useBackendAuth: APP_MODE !== 'LOCAL',
};

/**
 * Helper para construir URLs con query parameters
 * @param {string} endpoint - Endpoint relativo (ej: '/productos')
 * @param {Object} params - Objeto con parámetros de consulta
 * @returns {string} URL completa con query params
 */
export const buildURL = (endpoint, params = {}) => {
  if (APP_MODE === 'LOCAL') {
    console.warn('buildURL llamado en modo LOCAL - las URLs no se usarán');
    return null;
  }

  const url = new URL(endpoint, API_BASE_URL);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * Log de configuración (solo en desarrollo)
 */
if (APP_MODE === 'DEVELOPMENT') {
  console.log('🌐 Configuración de la Aplicación:', {
    '🔧 Modo': APP_MODE,
    '🌍 URL Base': API_BASE_URL || 'N/A (modo LOCAL)',
    '⏱️ Timeout': `${API_TIMEOUT}ms`,
    '🔐 Auth Backend': AUTH_CONFIG.useBackendAuth ? 'SÍ' : 'NO (localStorage)',
  });
}

/**
 * Validación de configuración
 */
if (!['LOCAL', 'DEVELOPMENT', 'PRODUCTION'].includes(APP_MODE)) {
  throw new Error(
    `❌ APP_MODE inválido: "${APP_MODE}". ` +
    `Valores permitidos: 'LOCAL', 'DEVELOPMENT', 'PRODUCTION'`
  );
}

if (APP_MODE !== 'LOCAL' && !API_BASE_URL) {
  console.error(
    `⚠️ ADVERTENCIA: APP_MODE es "${APP_MODE}" pero no hay URL configurada. ` +
    `Asegúrate de configurar VITE_API_BASE_URL_PROD en tu archivo .env`
  );
}
