/**
 * Servicio de Caja Chica
 * 
 * Implementa todos los endpoints de la API de caja chica del backend
 */

import httpClient from './httpClient';
import { cajaChicaEndpoints } from '../config/api';

const cajaChicaService = {
  /**
   * Obtener todos los movimientos de caja chica
   * GET /api/caja-chica
   */
  async getAll() {
    try {
      const movimientos = await httpClient.get(cajaChicaEndpoints.getAll);
      return movimientos;
    } catch (error) {
      console.error('Error al obtener movimientos de caja chica:', error);
      throw error;
    }
  },

  /**
   * Obtener un movimiento de caja chica por ID
   * GET /api/caja-chica/:id
   */
  async getById(id) {
    try {
      const movimiento = await httpClient.get(cajaChicaEndpoints.getById(id));
      return movimiento;
    } catch (error) {
      console.error(`Error al obtener movimiento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo movimiento de caja chica
   * POST /api/caja-chica
   * 
   * @param {Object} movimiento - Datos del movimiento
   * @param {string} movimiento.tipo - Tipo de movimiento (ingreso/egreso)
   * @param {number} movimiento.monto - Monto del movimiento
   * @param {string} movimiento.concepto - Concepto del movimiento
   * @param {string} movimiento.responsable - Responsable del movimiento
   */
  async create(movimiento) {
    try {
      const nuevoMovimiento = await httpClient.post(
        cajaChicaEndpoints.create,
        movimiento
      );
      return nuevoMovimiento;
    } catch (error) {
      console.error('Error al crear movimiento de caja chica:', error);
      throw error;
    }
  },

  /**
   * Actualizar un movimiento de caja chica
   * PUT /api/caja-chica/:id
   */
  async update(id, movimiento) {
    try {
      const movimientoActualizado = await httpClient.put(
        cajaChicaEndpoints.update(id),
        movimiento
      );
      return movimientoActualizado;
    } catch (error) {
      console.error(`Error al actualizar movimiento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un movimiento de caja chica
   * DELETE /api/caja-chica/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(cajaChicaEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar movimiento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener balance de caja chica
   * GET /api/caja-chica/balance
   */
  async getBalance() {
    try {
      const balance = await httpClient.get(cajaChicaEndpoints.balance);
      return balance;
    } catch (error) {
      console.error('Error al obtener balance de caja chica:', error);
      throw error;
    }
  },
};

export default cajaChicaService;
