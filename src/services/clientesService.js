/**
 * Servicio de Clientes
 * 
 * Implementa todos los endpoints de la API de clientes del backend
 */

import httpClient from './httpClient';
import { clientesEndpoints } from '../config/api';

const clientesService = {
  /**
   * Verificar si un cliente aplica para descuento de fidelidad
   * GET /api/ventas/cliente/:idCliente/descuento-fidelidad
   */
  async verificarDescuentoFidelidad(idCliente) {
    try {
      const response = await httpClient.get(clientesEndpoints.descuentoFidelidad(idCliente));
      return response;
    } catch (error) {
      console.error(`Error al verificar descuento de fidelidad para cliente ${idCliente}:`, error);
      return { aplicaDescuentoFidelidad: false, porcentaje: 0 };
    }
  },

  /**
   * Obtener todos los clientes
   * GET /api/clientes
   */
  async getAll() {
    try {
      const clientes = await httpClient.get(clientesEndpoints.getAll);
      return clientes;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  /**
   * Obtener un cliente por ID
   * GET /api/clientes/:id
   */
  async getById(id) {
    try {
      const cliente = await httpClient.get(clientesEndpoints.getById(id));
      return cliente;
    } catch (error) {
      console.error(`Error al obtener cliente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo cliente
   * POST /api/clientes
   * 
   * @param {Object} cliente - Datos del cliente
   * @param {string} cliente.dni - DNI del cliente
   * @param {string} cliente.nombre - Nombre completo
   * @param {string} cliente.telefono - Teléfono (opcional)
   * @param {string} cliente.email - Email (opcional)
   */
  async create(cliente) {
    try {
      const nuevoCliente = await httpClient.post(
        clientesEndpoints.create,
        cliente
      );
      return nuevoCliente;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  /**
   * Actualizar un cliente
   * PUT /api/clientes/:id
   * 
   * @param {number} id - ID del cliente
   * @param {Object} cliente - Datos del cliente
   */
  async update(id, cliente) {
    try {
      const clienteActualizado = await httpClient.put(
        clientesEndpoints.update(id),
        cliente
      );
      return clienteActualizado;
    } catch (error) {
      console.error(`Error al actualizar cliente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un cliente
   * DELETE /api/clientes/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(clientesEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar cliente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar clientes
   * GET /api/clientes/search?q=
   * 
   * @param {string} query - Término de búsqueda
   */
  async search(query) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      
      const clientes = await httpClient.get(
        `${clientesEndpoints.search}?${params.toString()}`
      );
      return clientes;
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      throw error;
    }
  },
};

export default clientesService;
