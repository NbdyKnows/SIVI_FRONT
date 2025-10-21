/**
 * Servicio de Productos - Ejemplo de uso
 * 
 * Este archivo muestra cómo usar httpClient y API_ENDPOINTS
 * para crear un servicio completo de productos.
 * 
 * Puedes crear servicios similares para: ventas, usuarios, inventario, etc.
 */

import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';

const productosService = {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>} Lista de productos
   */
  async getAll() {
    try {
      const productos = await httpClient.get(API_ENDPOINTS.productos.getAll);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Producto encontrado
   */
  async getById(id) {
    try {
      const producto = await httpClient.get(API_ENDPOINTS.productos.getById(id));
      return producto;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto
   * @param {Object} producto - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async create(producto) {
    try {
      const nuevoProducto = await httpClient.post(
        API_ENDPOINTS.productos.create,
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
   * @param {string} id - ID del producto
   * @param {Object} producto - Datos actualizados
   * @returns {Promise<Object>} Producto actualizado
   */
  async update(id, producto) {
    try {
      const productoActualizado = await httpClient.put(
        API_ENDPOINTS.productos.update(id),
        producto
      );
      return productoActualizado;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un producto
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(API_ENDPOINTS.productos.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar productos
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array>} Productos encontrados
   */
  async search(query) {
    try {
      const productos = await httpClient.get(
        `${API_ENDPOINTS.productos.search}?q=${encodeURIComponent(query)}`
      );
      return productos;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por categoría
   * @param {string} categoria - Nombre de la categoría
   * @returns {Promise<Array>} Productos de la categoría
   */
  async getByCategory(categoria) {
    try {
      const productos = await httpClient.get(
        API_ENDPOINTS.productos.byCategory(categoria)
      );
      return productos;
    } catch (error) {
      console.error(`Error al obtener productos de categoría ${categoria}:`, error);
      throw error;
    }
  },
};

export default productosService;
