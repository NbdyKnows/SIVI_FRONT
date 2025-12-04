/**
 * Endpoints de Clientes
 */

import { API_BASE_URL } from '../apiConfig';

export const clientesEndpoints = {
  base: `${API_BASE_URL}/clientes`,
  getAll: `${API_BASE_URL}/clientes`,
  getById: (id) => `${API_BASE_URL}/clientes/${id}`,
  getByDni: (dni) => `${API_BASE_URL}/clientes/dni/${dni}`,
  create: `${API_BASE_URL}/clientes`,
  update: (id) => `${API_BASE_URL}/clientes/${id}`,
  delete: (id) => `${API_BASE_URL}/clientes/${id}`,
  search: `${API_BASE_URL}/clientes/search`,
  descuentoFidelidad: (idCliente) => `${API_BASE_URL}/ventas/cliente/${idCliente}/descuento-fidelidad`,
};
