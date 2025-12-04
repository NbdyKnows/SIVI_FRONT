/**
 * Servicio de Ofertas (Sistema Nuevo)
 * 
 * Implementa todos los endpoints de la API de ofertas del backend
 */

import httpClient from './httpClient';
import { ofertasEndpoints } from '../config/endpoints/ofertasEndpoints';

const ofertasService = {

  /**
   * Obtener todas las ofertas
   * GET /ofertas
   */
  async getAll() {
    try {
      const ofertas = await httpClient.get(ofertasEndpoints.getAll);
      return ofertas;
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      throw error;
    }
  },

  /**
   * Obtener oferta por ID
   * GET /ofertas/{id}
   */
  async getById(id) {
    try {
      const oferta = await httpClient.get(ofertasEndpoints.getById(id));
      return oferta;
    } catch (error) {
      console.error(`Error al obtener oferta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear nueva oferta (solo ADMIN)
   * POST /ofertas
   * @param {Object} oferta - { id_tipo_oferta, id, descripcion, fecha_inicio, fecha_fin, descuento }
   */
  async create(oferta) {
    try {
      const nuevaOferta = await httpClient.post(
        ofertasEndpoints.create,
        oferta
      );
      return nuevaOferta;
    } catch (error) {
      console.error('Error al crear oferta:', error);
      throw error;
    }
  },

  /**
   * Actualizar oferta (solo ADMIN)
   * PUT /ofertas/{id}
   */
  async update(id, oferta) {
    try {
      const ofertaActualizada = await httpClient.put(
        ofertasEndpoints.update(id),
        oferta
      );
      return ofertaActualizada;
    } catch (error) {
      console.error(`Error al actualizar oferta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar oferta (solo ADMIN)
   * DELETE /ofertas/{id}
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(ofertasEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar oferta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener ofertas vigentes HOY
   * GET /ofertas/vigentes
   */
  async getVigentes() {
    try {
      const ofertas = await httpClient.get(ofertasEndpoints.vigentes);
      return ofertas;
    } catch (error) {
      console.error('Error al obtener ofertas vigentes:', error);
      throw error;
    }
  },

  /**
   * Obtener mejor oferta aplicable con PRIORIDAD
   * GET /ofertas/aplicable/{idProducto}?idCategoria=X
   * Prioridad: 1) Producto específico, 2) Categoría, 3) General
   */
  async getAplicable(idProducto, idCategoria = null) {
    try {
      const oferta = await httpClient.get(
        ofertasEndpoints.aplicable(idProducto, idCategoria)
      );
      return oferta;
    } catch (error) {
      console.error(`Error al obtener oferta aplicable para producto ${idProducto}:`, error);
      throw error;
    }
  },

  /**
   * Obtener todas las ofertas de un producto
   * GET /ofertas/producto/{idProducto}
   */
  async getByProducto(idProducto) {
    try {
      const ofertas = await httpClient.get(ofertasEndpoints.producto(idProducto));
      return ofertas;
    } catch (error) {
      console.error(`Error al obtener ofertas del producto ${idProducto}:`, error);
      throw error;
    }
  },

  /**
   * Obtener ofertas por categoría
   * GET /ofertas/categoria/{idCategoria}
   */
  async getByCategoria(idCategoria) {
    try {
      const ofertas = await httpClient.get(ofertasEndpoints.categoria(idCategoria));
      return ofertas;
    } catch (error) {
      console.error(`Error al obtener ofertas de categoría ${idCategoria}:`, error);
      throw error;
    }
  },

  /**
   * Obtener ofertas por tipo
   * GET /ofertas/tipo/{idTipo}
   * idTipo: 1=Producto, 2=Categoría, 3=General
   */
  async getByTipo(idTipo) {
    try {
      const ofertas = await httpClient.get(ofertasEndpoints.tipo(idTipo));
      return ofertas;
    } catch (error) {
      console.error(`Error al obtener ofertas de tipo ${idTipo}:`, error);
      throw error;
    }
  },

  /**
   * Obtener ofertas próximas a vencer
   * GET /ofertas/proximas-vencer?dias=7
   */
  async getProximasVencer(dias = 7) {
    try {
      const ofertas = await httpClient.get(ofertasEndpoints.proximasVencer(dias));
      return ofertas;
    } catch (error) {
      console.error(`Error al obtener ofertas próximas a vencer:`, error);
      throw error;
    }
  },
};

export default ofertasService;
