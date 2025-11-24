/**
 * Endpoints de Usuarios
 */

import { API_BASE_URL } from '../appConfig';

export const usuariosEndpoints = {
  base: `${API_BASE_URL}/usuarios`,
  getAll: `${API_BASE_URL}/usuarios`,
  getById: (id) => `${API_BASE_URL}/usuarios/${id}`,
  create: `${API_BASE_URL}/usuarios`,
  update: (id) => `${API_BASE_URL}/usuarios/${id}`,
  delete: (id) => `${API_BASE_URL}/usuarios/${id}`,
  changePassword: `${API_BASE_URL}/usuarios/password`,
  disable: (id) => `${API_BASE_URL}/usuarios/${id}/disable`,
  enable: (id) => `${API_BASE_URL}/usuarios/${id}/enable`,
};
