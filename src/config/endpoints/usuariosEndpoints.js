/**
 * Endpoints de Usuarios
 */

import { API_BASE_URL } from '../apiConfig';

export const usuariosEndpoints = {
  base: `${API_BASE_URL}/api/usuarios`,
  getAll: `${API_BASE_URL}/api/usuarios`,
  getById: (id) => `${API_BASE_URL}/api/usuarios/${id}`,
  create: `${API_BASE_URL}/api/usuarios`,
  update: (id) => `${API_BASE_URL}/api/usuarios/${id}`,
  delete: (id) => `${API_BASE_URL}/api/usuarios/${id}`,
  updatePassword: (id) => `${API_BASE_URL}/api/usuarios/${id}/password`,
};
