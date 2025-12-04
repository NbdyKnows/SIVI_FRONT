/**
 * Endpoints de Tipo de Oferta
 * Ruta base: /tipo-oferta
 */

import { API_BASE_URL } from '../apiConfig';

export const tipoOfertaEndpoints = {
  base: `${API_BASE_URL}/tipo-oferta`,
  getAll: `${API_BASE_URL}/tipo-oferta`,
  getById: (id) => `${API_BASE_URL}/tipo-oferta/${id}`,
  create: `${API_BASE_URL}/tipo-oferta`,
  update: (id) => `${API_BASE_URL}/tipo-oferta/${id}`,
  delete: (id) => `${API_BASE_URL}/tipo-oferta/${id}`,
};
