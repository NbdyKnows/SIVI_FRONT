import httpClient from './httpClient';
import categoriasEndpoints from '../config/endpoints/categoriasEndpoints';

/**
 * Servicio para gestionar categorías de productos
 */
const categoriasService = {
  /**
   * Obtener todas las categorías
   * @returns {Promise<Array>} Lista de categorías
   */
  async getAll() {
    try {
      const data = await httpClient.get(categoriasEndpoints.getAll);
      return data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  /**
   * Obtener una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise<Object>} Datos de la categoría
   */
  async getById(id) {
    try {
      const data = await httpClient.get(categoriasEndpoints.getById(id));
      return data;
    } catch (error) {
      if (error.status === 404) {
        console.warn(`Categoría con ID ${id} no encontrada`);
        return null;
      }
      console.error('Error al obtener categoría:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva categoría
   * @param {Object} categoriaData - Datos de la categoría
   * @param {string} categoriaData.descripcion - Descripción de la categoría
   * @returns {Promise<Object>} Categoría creada
   */
  async create(categoriaData) {
    try {
      const data = await httpClient.post(
        categoriasEndpoints.create,
        categoriaData
      );
      return data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  },

  /**
   * Actualizar una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoriaData - Datos actualizados
   * @param {string} categoriaData.descripcion - Nueva descripción
   * @returns {Promise<Object>} Categoría actualizada
   */
  async update(id, categoriaData) {
    try {
      const data = await httpClient.put(
        categoriasEndpoints.update(id),
        categoriaData
      );
      return data;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  },

  /**
   * Eliminar una categoría
   * @param {number} id - ID de la categoría
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await httpClient.delete(categoriasEndpoints.delete(id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  }
};

export default categoriasService;
