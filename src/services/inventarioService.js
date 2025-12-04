/**
 * Servicio de Inventario
 * 
 * Implementa todos los endpoints de la API de inventario del backend
 */

import httpClient from './httpClient';
import { inventarioEndpoints } from '../config/api';

const inventarioService = {
  /**
   * Obtener todo el inventario
   * GET /api/inventario
   */
  async getAll() {
    try {
      const inventario = await httpClient.get(inventarioEndpoints.getAll);
      return inventario;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw error;
    }
  },

  /**
   * Obtener todo el inventario
   * GET /api/inventario
   */
  async getDetallePanel() {
    try {
      const inventario = await httpClient.get(inventarioEndpoints.detallePanel);
      return inventario;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw error;
    }
  },

  /**
<<<<<<< HEAD
   * Obtener todo el inventario
   * GET /api/inventario
   */
  async getDetallePanelForCatalog() {
    try {
      const inventario = await httpClient.get(inventarioEndpoints.detallePanel);
      return inventario;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw error;
    }
  },

  /**
=======
>>>>>>> master
   * Obtener inventario por ID
   * GET /api/inventario/:id
   */
  async getById(id) {
    try {
      const inventario = await httpClient.get(inventarioEndpoints.getById(id));
      return inventario;
    } catch (error) {
      console.error(`Error al obtener inventario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar inventario
   * PUT /api/inventario/:id
   * 
   * @param {number} id - ID del inventario
   * @param {Object} data - Datos a actualizar
   * @param {number} data.stock - Nuevo stock
   * @param {number} data.precio - Nuevo precio
   */
  async update(id, data) {
    try {
      const inventarioActualizado = await httpClient.put(
        inventarioEndpoints.update(id),
        data
      );
      return inventarioActualizado;
    } catch (error) {
      console.error(`Error al actualizar inventario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Agregar stock al inventario
   * POST /api/inventario/agregar-stock
   * 
   * @param {Object} data - Datos para agregar stock
   * @param {number} data.id_producto - ID del producto
   * @param {number} data.cantidad - Cantidad a agregar
   * @param {number} data.precio - Precio unitario
   * @param {string} data.motivo - Motivo del movimiento
   */
  async agregarStock(data) {
    try {
      const resultado = await httpClient.post(
        inventarioEndpoints.agregarStock,
        data
      );
      return resultado;
    } catch (error) {
      console.error('Error al agregar stock:', error);
      throw error;
    }
  },

  /**
   * Ajustar stock del inventario
   * POST /api/inventario/ajustar-stock
   * 
   * @param {Object} data - Datos para ajustar stock
   * @param {number} data.id_producto - ID del producto
   * @param {number} data.cantidad - Nueva cantidad
   * @param {string} data.motivo - Motivo del ajuste
   */
  async ajustarStock(data) {
    try {
      const resultado = await httpClient.post(
        inventarioEndpoints.ajustarStock,
        data
      );
      return resultado;
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      throw error;
    }
  },

  /**
   * Obtener productos con bajo stock
   * GET /api/inventario/bajo-stock
   */
  async getBajoStock() {
    try {
      const productos = await httpClient.get(inventarioEndpoints.bajoStock);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      throw error;
    }
  },
};

export default inventarioService;
