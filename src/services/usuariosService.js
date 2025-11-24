/**
 * Servicio de Usuarios
 * 
 * Implementa todos los endpoints de la API de usuarios del backend
 */

import httpClient from './httpClient';
import { usuariosEndpoints } from '../config/api';

const usuariosService = {
  /**
   * Obtener todos los usuarios
   * GET /usuarios
   */
  async getAll() {
    try {
      const usuarios = await httpClient.get(usuariosEndpoints.getAll);
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener un usuario por ID
   * GET /usuarios/:id
   */
  async getById(id) {
    try {
      const usuario = await httpClient.get(usuariosEndpoints.getById(id));
      return usuario;
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario
   * POST /usuarios
   * 
   * @param {Object} usuario - Datos del usuario
   * @param {string} usuario.usuario - Nombre de usuario
   * @param {string} usuario.nombre - Nombre completo
   * @param {number} usuario.idRol - ID del rol
   */
  async create(usuario) {
    try {
      const nuevoUsuario = await httpClient.post(
        usuariosEndpoints.create,
        usuario
      );
      return nuevoUsuario;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario
   * PUT /usuarios/:id
   * 
   * @param {number} id - ID del usuario
   * @param {Object} usuario - Datos del usuario
   * @param {string} usuario.usuario - Nombre de usuario
   * @param {string} usuario.nombre - Nombre completo
   * @param {boolean} usuario.habilitado - Estado del usuario
   * @param {boolean} usuario.reset - Si requiere cambio de contraseña
   */
  async update(id, usuario) {
    try {
      const usuarioActualizado = await httpClient.put(
        usuariosEndpoints.update(id),
        usuario
      );
      return usuarioActualizado;
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario (físicamente)
   * DELETE /usuarios/:id
   */
  async delete(id) {
    try {
      const resultado = await httpClient.delete(usuariosEndpoints.delete(id));
      return resultado;
    } catch (error) {
      console.error(`Error al eliminar usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña de usuario
   * PATCH /usuarios/password
   * 
   * @param {Object} data - Datos para cambio de contraseña
   * @param {string} data.usuario - Nombre de usuario
   * @param {string} data.nueva - Nueva contraseña
   */
  async changePassword(data) {
    try {
      const resultado = await httpClient.patch(
        usuariosEndpoints.changePassword,
        data
      );
      return resultado;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },

  /**
   * Deshabilitar un usuario
   * PATCH /usuarios/:id/disable
   */
  async disable(id) {
    try {
      const resultado = await httpClient.patch(usuariosEndpoints.disable(id));
      return resultado;
    } catch (error) {
      console.error(`Error al deshabilitar usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Habilitar un usuario
   * PATCH /usuarios/:id/enable
   */
  async enable(id) {
    try {
      const resultado = await httpClient.patch(usuariosEndpoints.enable(id));
      return resultado;
    } catch (error) {
      console.error(`Error al habilitar usuario ${id}:`, error);
      throw error;
    }
  },
};

export default usuariosService;
