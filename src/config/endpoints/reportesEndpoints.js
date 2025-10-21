/**
 * Endpoints de Reportes
 */

import { API_BASE_URL } from '../apiConfig';

export const reportesEndpoints = {
  base: `${API_BASE_URL}/api/reportes`,
  ventas: `${API_BASE_URL}/api/reportes/ventas`,
  inventario: `${API_BASE_URL}/api/reportes/inventario`,
  financiero: `${API_BASE_URL}/api/reportes/financiero`,
  productos: `${API_BASE_URL}/api/reportes/productos`,
  general: `${API_BASE_URL}/api/reportes/general`,
};
