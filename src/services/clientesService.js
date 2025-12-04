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
   * Obtener un cliente por DNI
   * GET /api/clientes/dni/:dni
   */
  async getByDni(dni) {
    try {
      const cliente = await httpClient.get(clientesEndpoints.getByDni(dni));
      return cliente;
    } catch (error) {
      // Si no se encuentra el cliente (404), devolver null en lugar de lanzar error
      if (error.status === 404) {
        return null;
      }
      console.error(`Error al obtener cliente con DNI ${dni}:`, error);
      throw error;
    }
  },

  /**
   * Consultar DNI en RENIEC
   * GET https://api.codart.cgrt.net/api/v1/consultas/reniec/dni/:dni
   */
  async consultarReniec(dni) {
    try {
      const token = import.meta.env.VITE_RENIEC_API_TOKEN;
      const response = await fetch(
        `https://api.codart.cgrt.net/api/v1/consultas/reniec/dni/${dni}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error al consultar RENIEC: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.result) {
        return {
          success: true,
          nombre: data.result.full_name,
          datos: data.result
        };
      }

      return { success: false, message: 'No se encontró información del DNI' };
    } catch (error) {
      console.error(`Error al consultar RENIEC para DNI ${dni}:`, error);
      throw error;
    }
  },

  /**
   * Verificar y registrar cliente para venta
   * - Primero busca si existe en la BD por DNI
   * - Si no existe, consulta RENIEC y registra automáticamente
   * - Retorna los datos del cliente listos para usar en la venta
   * 
   * @param {string} dni - DNI del cliente
   * @returns {Object} - Datos del cliente { id, dni, nombre }
   */
  async verificarYRegistrarCliente(dni) {
    try {
      // 1. Verificar si el cliente ya existe en la BD
      const clienteExistente = await this.getByDni(dni);
      
      if (clienteExistente) {
        // Cliente existe, retornar sus datos
        return {
          success: true,
          cliente: clienteExistente,
          mensaje: 'Cliente encontrado'
        };
      }

      // 2. Cliente no existe, consultar RENIEC
      const datosReniec = await this.consultarReniec(dni);
      
      if (!datosReniec.success) {
        return {
          success: false,
          mensaje: 'No se pudo obtener información del DNI'
        };
      }

      // 3. Registrar el nuevo cliente con datos de RENIEC
      const nuevoCliente = await this.create({
        dni: dni,
        nombres: datosReniec.nombre
      });

      return {
        success: true,
        cliente: nuevoCliente,
        mensaje: 'Cliente registrado automáticamente',
        nuevoRegistro: true
      };
    } catch (error) {
      console.error(`Error al verificar y registrar cliente con DNI ${dni}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo cliente
   * POST /api/clientes
   * 
   * @param {Object} cliente - Datos del cliente
   * @param {string} cliente.dni - DNI del cliente
   * @param {string} cliente.nombres - Nombre completo
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
