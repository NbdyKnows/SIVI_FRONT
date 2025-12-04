/**
 * Endpoints para la gestión de categorías
 */
const categoriasEndpoints = {
  // Obtener todas las categorías
  getAll: '/almacen/categorias',
  
  // Obtener categoría por ID
  getById: (id) => `/almacen/categorias/${id}`,
  
  // Crear nueva categoría
  create: '/almacen/categorias',
  
  // Actualizar categoría
  update: (id) => `/almacen/categorias/${id}`,
  
  // Eliminar categoría
  delete: (id) => `/almacen/categorias/${id}`
};

export default categoriasEndpoints;
