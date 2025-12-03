/**
 * Servicio de Descuentos
 * 
 * Implementa todos los endpoints de la API de descuentos del backend
 */

import httpClient from './httpClient';
import { descuentosEndpoints } from '../config/api';

const descuentosService = {

  async getAll() {
    try {
      const descuentos = await httpClient.get(descuentosEndpoints.getAll);
      return descuentos;
    } catch (error) {
      console.error('Error al obtener descuentos:', error);
      throw error;
    }
  },


  async getById(id) {
    try {
      const descuento = await httpClient.get(descuentosEndpoints.getById(id));
      return descuento;
    } catch (error) {
      console.error(`Error al obtener descuento ${id}:`, error);
      throw error;
    }
  },


  async create(descuento) {
    try {
      const nuevoDescuento = await httpClient.post(
        descuentosEndpoints.create,
        descuento
      );
      return nuevoDescuento;
    } catch (error) {
      console.error('Error al crear descuento:', error);
      throw error;
    }
  },


  async update(id, descuento) {
    try {
      const descuentoActualizado = await httpClient.put(
        descuentosEndpoints.update(id),
        descuento
      );
      return descuentoActualizado;
    } catch (error) {
      console.error(`Error al actualizar descuento ${id}:`, error);
      throw error;
    }
  },


  async delete(id) {
    try {
      const resultado = await httpClient.delete(descuentosEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar descuento ${id}:`, error);
      throw error;
    }
  },


  async getActivos() {
    try {
      const descuentos = await httpClient.get(descuentosEndpoints.activos);
      return descuentos;
    } catch (error) {
      console.error('Error al obtener descuentos activos:', error);
      throw error;
    }
  },


  async getEstadisticas() {
    try {
      const estadisticas = await httpClient.get(descuentosEndpoints.estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas de descuentos:', error);
      throw error;
    }
  },
};

export default descuentosService;
