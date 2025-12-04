/**
 * Endpoints de Ofertas (Sistema Nuevo)
 * Ruta base: /ofertas
 */

import { API_BASE_URL } from '../apiConfig';

export const ofertasEndpoints = {
  base: `${API_BASE_URL}/ofertas`,
  
  // CRUD básico
  getAll: `${API_BASE_URL}/ofertas`,
  getById: (id) => `${API_BASE_URL}/ofertas/${id}`,
  create: `${API_BASE_URL}/ofertas`,
  update: (id) => `${API_BASE_URL}/ofertas/${id}`,
  delete: (id) => `${API_BASE_URL}/ofertas/${id}`,
  
  // Endpoints específicos
  vigentes: `${API_BASE_URL}/ofertas/vigentes`,
  aplicable: (idProducto, idCategoria) => 
    `${API_BASE_URL}/ofertas/aplicable/${idProducto}${idCategoria ? `?idCategoria=${idCategoria}` : ''}`,
  producto: (idProducto) => `${API_BASE_URL}/ofertas/producto/${idProducto}`,
  categoria: (idCategoria) => `${API_BASE_URL}/ofertas/categoria/${idCategoria}`,
  tipo: (idTipo) => `${API_BASE_URL}/ofertas/tipo/${idTipo}`,
  proximasVencer: (dias = 7) => `${API_BASE_URL}/ofertas/proximas-vencer?dias=${dias}`,
};
