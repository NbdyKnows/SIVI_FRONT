/**
 * Exportación centralizada de servicios
 * 
 * Importa y exporta todos los servicios para facilitar su uso
 */

export { default as httpClient, APIError } from './httpClient';
export { default as authService } from './authService';
export { default as productosService } from './productosService';
export { default as usuariosService } from './usuariosService';
export { default as ventasService } from './ventasService';
export { default as inventarioService } from './inventarioService';
export { default as comprasService } from './comprasService';
export { default as proveedoresService } from './proveedoresService';
export { default as clientesService } from './clientesService';
export { default as descuentosService } from './descuentosService';
export { default as cajaChicaService } from './cajaChicaService';
export { default as movimientosService } from './movimientosService';
export { default as reportesService } from './reportesService';
export { getChatResponse } from './ChatIA';
