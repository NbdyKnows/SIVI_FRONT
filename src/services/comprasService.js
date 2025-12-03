/**
 * Servicio de Compras
 * 
 * Implementa todos los endpoints de la API de compras del backend
 */

import httpClient from './httpClient';
import { comprasEndpoints } from '../config/api';

const comprasService = {
  /**
   * Obtener todas las compras
   * GET /api/compras
   */
  async getAll() {
    try {
      const compras = await httpClient.get(comprasEndpoints.getAll);
      return compras;
    } catch (error) {
      console.error('Error al obtener compras:', error);
      throw error;
    }
  },

  /**
   * Obtener una compra por ID
   * GET /api/compras/:id
   */
  async getById(id) {
    try {
      const compra = await httpClient.get(comprasEndpoints.getById(id));
      return compra;
    } catch (error) {
      console.error(`Error al obtener compra ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva compra
   * POST /api/compras
   * 
   * @param {Object} compra - Datos de la compra
   * @param {number} compra.id_proveedor - ID del proveedor
   * @param {Array} compra.productos - Array de productos a comprar
   * @param {string} compra.observaciones - Observaciones de la compra
   */
  async create(compra) {
    try {
      const nuevaCompra = await httpClient.post(
        comprasEndpoints.create,
        compra
      );
      return nuevaCompra;
    } catch (error) {
      console.error('Error al crear compra:', error);
      throw error;
    }
  },

  /**
   * Actualizar una compra
   * PUT /api/compras/:id
   */
  async update(id, compra) {
    try {
      const compraActualizada = await httpClient.put(
        comprasEndpoints.update(id),
        compra
      );
      return compraActualizada;
    } catch (error) {
      console.error(`Error al actualizar compra ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una compra
   * DELETE /api/compras/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(comprasEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar compra ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener compras por proveedor
   * GET /api/compras/proveedor/:proveedorId
   */
  async getByProveedor(proveedorId) {
    try {
      const compras = await httpClient.get(
        comprasEndpoints.byProveedor(proveedorId)
      );
      return compras;
    } catch (error) {
      console.error(`Error al obtener compras del proveedor ${proveedorId}:`, error);
      throw error;
    }
  },
};

export default comprasService;
