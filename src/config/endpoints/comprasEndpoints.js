/**
 * Endpoints de Compras
 */

import { API_BASE_URL } from '../apiConfig';

export const comprasEndpoints = {
  registrar: '/orden-compra/registrar',
  aprobar: (id) => `/orden-compra/aprobar/${id}`,
  lista: '/orden-compra/lista',
  buscarPorId: (id) => `/orden-compra/${id}`,
  buscarPorCodigo: (codigo) => `/orden-compra/codigo/${codigo}`,
  deshabilitar: (id) => `/orden-compra/deshabilitar/${id}`,
};