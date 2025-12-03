/**
 * Servicio de Ventas
 * 
 * Implementa todos los endpoints de la API de ventas del backend
 */

import httpClient from './httpClient';
import { ventasEndpoints } from '../config/api';

const ventasService = {
  /**
   * Obtener todas las ventas
   * GET /api/ventas
   */
  async getAll() {
    try {
      const ventas = await httpClient.get(ventasEndpoints.getAll);
      return ventas;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  },

  /**
   * Obtener una venta por ID
   * GET /api/ventas/:id
   */
  async getById(id) {
    try {
      const venta = await httpClient.get(ventasEndpoints.getById(id));
      return venta;
    } catch (error) {
      console.error(`Error al obtener venta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva venta
   * POST /api/ventas
   * 
   * @param {Object} venta - Datos de la venta
   * @param {string} venta.vendedor - Username del vendedor
   * @param {string} venta.cliente - DNI del cliente o "Sin registro"
   * @param {string} venta.metodoPago - Método de pago (Efectivo, Tarjeta, Yape/Plin)
   * @param {Array} venta.productos - Array de productos vendidos
   * @param {number} venta.subtotal - Subtotal sin IGV
   * @param {number} venta.igv - Monto del IGV
   * @param {number} venta.descuento_productos - Descuento por productos
   * @param {Object} venta.descuento_fidelidad - Descuento de fidelidad
   * @param {number} venta.total - Total de la venta
   */
  async create(venta) {
    try {
      const nuevaVenta = await httpClient.post(
        ventasEndpoints.create,
        venta
      );
      return nuevaVenta;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  },

  /**
   * Actualizar una venta
   * PUT /api/ventas/:id
   */
  async update(id, venta) {
    try {
      const ventaActualizada = await httpClient.put(
        ventasEndpoints.update(id),
        venta
      );
      return ventaActualizada;
    } catch (error) {
      console.error(`Error al actualizar venta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una venta
   * DELETE /api/ventas/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(ventasEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar venta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener ventas por fecha
   * GET /api/ventas/fecha?desde=&hasta=
   */
  async getByFecha(desde, hasta) {
    try {
      const params = new URLSearchParams();
      if (desde) params.append('desde', desde);
      if (hasta) params.append('hasta', hasta);
      
      const ventas = await httpClient.get(
        `${ventasEndpoints.byDate}?${params.toString()}`
      );
      return ventas;
    } catch (error) {
      console.error('Error al obtener ventas por fecha:', error);
      throw error;
    }
  },

  /**
   * Obtener ventas por vendedor
   * GET /api/ventas/vendedor/:vendedorId
   */
  async getByVendedor(vendedorId) {
    try {
      const ventas = await httpClient.get(
        ventasEndpoints.byVendedor(vendedorId)
      );
      return ventas;
    } catch (error) {
      console.error(`Error al obtener ventas del vendedor ${vendedorId}:`, error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de ventas
   * GET /api/ventas/estadisticas
   */
  async getEstadisticas() {
    try {
      const estadisticas = await httpClient.get(ventasEndpoints.statistics);
      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas de ventas:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de ventas por vendedor
   * GET /api/ventas/vendedor/:vendedorId/estadisticas
   */
  async getEstadisticasVendedor(vendedorId) {
    try {
      const estadisticas = await httpClient.get(ventasEndpoints.estadisticasVendedor(vendedorId));
      return estadisticas;
    } catch (error) {
      console.error(`Error al obtener estadísticas del vendedor ${vendedorId}:`, error);
      throw error;
    }
  },
};

export default ventasService;
