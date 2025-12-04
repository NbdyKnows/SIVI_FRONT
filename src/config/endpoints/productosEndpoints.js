/**
 * Endpoints de Productos
 */

import { API_BASE_URL } from '../appConfig';

export const productosEndpoints = {
  base: `${API_BASE_URL}/almacen/productos`,
  getAll: `${API_BASE_URL}/almacen/productos`,
  getById: (id) => `${API_BASE_URL}/almacen/productos/${id}`,
  create: (id) => `${API_BASE_URL}/almacen/productos/${id}`,
  update: (id) => `${API_BASE_URL}/almacen/productos/${id}`,
  delete: (id) => `${API_BASE_URL}/almacen/productos/${id}`,
  disable: (id) => `${API_BASE_URL}/almacen/productos/${id}/disable`,
  enable: (id) => `${API_BASE_URL}/almacen/productos/${id}/enable`,
  search: `${API_BASE_URL}/almacen/productos/search`,
  byCategory: (categoria) => `${API_BASE_URL}/almacen/productos/categoria/${categoria}`,
  listCatalogo:  `${API_BASE_URL}/almacen/productos/catalogoProductos`,
  listCategorias:  `${API_BASE_URL}/almacen/productos/listaCategorias`,
};
