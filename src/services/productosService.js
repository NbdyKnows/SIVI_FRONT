import httpClient from './httpClient';
import { productosEndpoints } from '../config/api';

const productosService = {
  async getAll() {
    try {
      const productos = await httpClient.get(productosEndpoints.getAll);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  async getCategorias() {
    try {
      const productos = await httpClient.get(productosEndpoints.listCategorias);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  async getCatalogo() {
    try {
      const productos = await httpClient.get(productosEndpoints.listCatalogo);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const producto = await httpClient.get(productosEndpoints.getById(id));
      return producto;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  },

  async create(id, producto) {
    try {
      const nuevoProducto = await httpClient.post(
        productosEndpoints.create(id),
        producto
      );
      return nuevoProducto;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto
   * PUT /almacen/productos/:id
   */
  async update(id, producto) {
    try {
      const productoActualizado = await httpClient.put(
        productosEndpoints.update(id),
        producto
      );
      return productoActualizado;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un producto (físicamente)
   * DELETE /almacen/productos/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(productosEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deshabilitar un producto
   * PATCH /almacen/productos/:id/disable
   */
  async disable(id) {
    try {
      const resultado = await httpClient.patch(productosEndpoints.disable(id));
      return resultado;
    } catch (error) {
      console.error(`Error al deshabilitar producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Habilitar un producto
   * PATCH /almacen/productos/:id/enable
   */
  async enable(id) {
    try {
      const resultado = await httpClient.patch(productosEndpoints.enable(id));
      return resultado;
    } catch (error) {
      console.error(`Error al habilitar producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar productos (autocomplete)
   * GET /almacen/productos/search?query=...
   */
  async search(query) {
    try {
      const productos = await httpClient.get(
        `${productosEndpoints.search}?query=${encodeURIComponent(query)}`
      );
      return productos;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por categoría
   * GET /almacen/productos/categoria/:categoria
   */
  async getByCategory(categoria) {
    try {
      const productos = await httpClient.get(
        productosEndpoints.byCategory(categoria)
      );
      return productos;
    } catch (error) {
      console.error(`Error al obtener productos de categoría ${categoria}:`, error);
      throw error;
    }
  },
};

export default productosService;
