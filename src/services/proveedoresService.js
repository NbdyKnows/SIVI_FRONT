/**
 * Servicio de Proveedores
 * 
 * Implementa todos los endpoints de la API de proveedores del backend
 */

import httpClient from './httpClient';
import { proveedoresEndpoints } from '../config/api';

const proveedoresService = {
  /**
   * Obtener todos los proveedores
   * GET /api/proveedores
   */
  async getAll() {
    try {
      const proveedores = await httpClient.get(proveedoresEndpoints.getAll);
      return proveedores;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  /**
   * Obtener un proveedor por ID
   * GET /api/proveedores/:id
   */
  async getById(id) {
    try {
      const proveedor = await httpClient.get(proveedoresEndpoints.getById(id));
      return proveedor;
    } catch (error) {
      console.error(`Error al obtener proveedor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo proveedor
   * POST /api/proveedores
   * 
   * @param {Object} proveedor - Datos del proveedor
   * @param {string} proveedor.descripcion - Nombre del proveedor
   * @param {string} proveedor.telefono - Teléfono de contacto
   */
  async create(proveedor) {
    try {
      const nuevoProveedor = await httpClient.post(
        proveedoresEndpoints.create,
        proveedor
      );
      return nuevoProveedor;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  },

  /**
   * Actualizar un proveedor
   * PUT /api/proveedores/:id
   * 
   * @param {number} id - ID del proveedor
   * @param {Object} proveedor - Datos del proveedor
   * @param {string} proveedor.descripcion - Nombre del proveedor
   * @param {string} proveedor.telefono - Teléfono de contacto
   */
  async update(id, proveedor) {
    try {
      const proveedorActualizado = await httpClient.put(
        proveedoresEndpoints.update(id),
        proveedor
      );
      return proveedorActualizado;
    } catch (error) {
      console.error(`Error al actualizar proveedor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un proveedor
   * DELETE /api/proveedores/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(proveedoresEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar proveedor ${id}:`, error);
      throw error;
    }
  },
};

export default proveedoresService;
