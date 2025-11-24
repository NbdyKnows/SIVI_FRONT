/**
 * API Configuration - Índice Central
 * 
 * Este archivo exporta toda la configuración de endpoints de forma organizada.
 * Cada módulo tiene su propio archivo de endpoints en la carpeta endpoints/
 */

// Exportar configuración base
export { API_BASE_URL, API_TIMEOUT, ENV_INFO, buildURL } from './apiConfig';

// Exportar endpoints por módulo
export { authEndpoints } from './endpoints/authEndpoints';
export { productosEndpoints } from './endpoints/productosEndpoints';
export { usuariosEndpoints } from './endpoints/usuariosEndpoints';
export { ventasEndpoints } from './endpoints/ventasEndpoints';
export { comprasEndpoints } from './endpoints/comprasEndpoints';
export { inventarioEndpoints } from './endpoints/inventarioEndpoints';
export { proveedoresEndpoints } from './endpoints/proveedoresEndpoints';
export { clientesEndpoints } from './endpoints/clientesEndpoints';
export { descuentosEndpoints } from './endpoints/descuentosEndpoints';
export { cajaChicaEndpoints } from './endpoints/cajaChicaEndpoints';
export { reportesEndpoints } from './endpoints/reportesEndpoints';

/**
 * Objeto con todos los endpoints organizados (opcional)
 * Útil si prefieres importar todo como un objeto
 */
import { authEndpoints } from './endpoints/authEndpoints';
import { productosEndpoints } from './endpoints/productosEndpoints';
import { usuariosEndpoints } from './endpoints/usuariosEndpoints';
import { ventasEndpoints } from './endpoints/ventasEndpoints';
import { comprasEndpoints } from './endpoints/comprasEndpoints';
import { inventarioEndpoints } from './endpoints/inventarioEndpoints';
import { proveedoresEndpoints } from './endpoints/proveedoresEndpoints';
import { clientesEndpoints } from './endpoints/clientesEndpoints';
import { descuentosEndpoints } from './endpoints/descuentosEndpoints';
import { cajaChicaEndpoints } from './endpoints/cajaChicaEndpoints';
import { reportesEndpoints } from './endpoints/reportesEndpoints';

export const API_ENDPOINTS = {
  auth: authEndpoints,
  productos: productosEndpoints,
  usuarios: usuariosEndpoints,
  ventas: ventasEndpoints,
  compras: comprasEndpoints,
  inventario: inventarioEndpoints,
  proveedores: proveedoresEndpoints,
  clientes: clientesEndpoints,
  descuentos: descuentosEndpoints,
  cajaChica: cajaChicaEndpoints,
  reportes: reportesEndpoints,
};

export default API_ENDPOINTS;
