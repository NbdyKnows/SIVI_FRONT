/**
 * Exportación centralizada de servicios
 * 
 * Importa y exporta todos los servicios para facilitar su uso
 */

export { default as httpClient, APIError } from './httpClient';
export { default as authService } from './authService';
export { default as productosService } from './productosService';
export { default as usuariosService } from './usuariosService';
export { getChatResponse } from './ChatIA';

// Cuando crees más servicios, expórtalos aquí:
// export { default as ventasService } from './ventasService';
// export { default as inventarioService } from './inventarioService';
