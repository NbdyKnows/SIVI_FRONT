/**
 * Configuración Base de la API
 * 
 * Este archivo re-exporta la configuración desde appConfig.js
 * para mantener compatibilidad con código existente.
 */

// Importar configuración centralizada
import {
  APP_MODE,
  API_BASE_URL,
  API_TIMEOUT,
  ENV_INFO,
  buildURL
} from './appConfig';

// Re-exportar todo para compatibilidad
export {
  APP_MODE,
  API_BASE_URL,
  API_TIMEOUT,
  ENV_INFO,
  buildURL
};
