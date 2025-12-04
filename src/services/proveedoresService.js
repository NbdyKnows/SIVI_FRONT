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
   * GET /api/proveedor
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
   * Obtener todos los proveedores con datos completos
   * GET /api/proveedor/datos
   */
  async getAllDatos() {
    try {
      const proveedores = await httpClient.get(proveedoresEndpoints.getAllDatos);
      return proveedores;
    } catch (error) {
      console.error('Error al obtener datos de proveedores:', error);
      throw error;
    }
  },

  /**
   * Obtener solo proveedores habilitados
   * GET /api/proveedor/habilitados
   */
  async getHabilitados() {
    try {
      const proveedores = await httpClient.get(proveedoresEndpoints.getHabilitados);
      return proveedores;
    } catch (error) {
      console.error('Error al obtener proveedores habilitados:', error);
      throw error;
    }
  },

  /**
   * Obtener un proveedor por ID
   * GET /api/proveedor/:id
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
   * Buscar proveedor por documento único
   * GET /api/proveedor/documentoUnico/:documento
   */
  async getByDocumentoUnico(documento) {
    try {
      const proveedor = await httpClient.get(proveedoresEndpoints.getByDocumentoUnico(documento));
      return proveedor;
    } catch (error) {
      console.error(`Error al buscar proveedor por documento ${documento}:`, error);
      throw error;
    }
  },

  /**
   * Buscar proveedores por documento (puede retornar varios)
   * GET /api/proveedor/documentoVarios/:documento
   */
  async getByDocumentoVarios(documento) {
    try {
      const proveedores = await httpClient.get(proveedoresEndpoints.getByDocumentoVarios(documento));
      return proveedores;
    } catch (error) {
      console.error(`Error al buscar proveedores por documento ${documento}:`, error);
      throw error;
    }
  },

  /**
   * Buscar proveedores por descripción
   * GET /api/proveedor/search?descripcion=texto
   */
  async search(descripcion) {
    try {
      const proveedores = await httpClient.get(`${proveedoresEndpoints.search}?descripcion=${descripcion}`);
      return proveedores;
    } catch (error) {
      console.error(`Error al buscar proveedores con descripción "${descripcion}":`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo proveedor
   * POST /api/proveedor
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
   * PUT /api/proveedor/:id
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
   * Deshabilitar un proveedor (soft delete)
   * PATCH /api/proveedor/:id/disable
   */
  async disable(id) {
    try {
      const resultado = await httpClient.patch(proveedoresEndpoints.disable(id));
      return resultado;
    } catch (error) {
      console.error(`Error al deshabilitar proveedor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Habilitar un proveedor
   * PATCH /api/proveedor/:id/enable
   */
  async enable(id) {
    try {
      const resultado = await httpClient.patch(proveedoresEndpoints.enable(id));
      return resultado;
    } catch (error) {
      console.error(`Error al habilitar proveedor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un proveedor (físico)
   * DELETE /api/proveedor/:id
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
