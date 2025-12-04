/**
 * Servicio de Tipo de Oferta
 * 
 * Implementa endpoints para gestionar tipos de ofertas (Producto, Categoría, General)
 */

import httpClient from './httpClient';
import { tipoOfertaEndpoints } from '../config/endpoints/tipoOfertaEndpoints';

const tipoOfertaService = {

  /**
   * Obtener todos los tipos de oferta
   * GET /tipo-oferta
   */
  async getAll() {
    try {
      const tipos = await httpClient.get(tipoOfertaEndpoints.getAll);
      return tipos;
    } catch (error) {
      console.error('Error al obtener tipos de oferta:', error);
      throw error;
    }
  },

  /**
   * Obtener tipo de oferta por ID
   * GET /tipo-oferta/{id}
   */
  async getById(id) {
    try {
      const tipo = await httpClient.get(tipoOfertaEndpoints.getById(id));
      return tipo;
    } catch (error) {
      console.error(`Error al obtener tipo de oferta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear nuevo tipo de oferta
   * POST /tipo-oferta
   */
  async create(tipo) {
    try {
      const nuevoTipo = await httpClient.post(
        tipoOfertaEndpoints.create,
        tipo
      );
      return nuevoTipo;
    } catch (error) {
      console.error('Error al crear tipo de oferta:', error);
      throw error;
    }
  },

  /**
   * Actualizar tipo de oferta
   * PUT /tipo-oferta/{id}
   */
  async update(id, tipo) {
    try {
      const tipoActualizado = await httpClient.put(
        tipoOfertaEndpoints.update(id),
        tipo
      );
      return tipoActualizado;
    } catch (error) {
      console.error(`Error al actualizar tipo de oferta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar tipo de oferta
   * DELETE /tipo-oferta/{id}
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(tipoOfertaEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar tipo de oferta ${id}:`, error);
      throw error;
    }
  },
};

export default tipoOfertaService;
