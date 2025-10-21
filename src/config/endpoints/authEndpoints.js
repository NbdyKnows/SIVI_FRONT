/**
 * Endpoints de Autenticación
 */

import { API_BASE_URL } from '../apiConfig';

export const authEndpoints = {
  login: `${API_BASE_URL}/api/auth/login`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  verify: `${API_BASE_URL}/api/auth/verify`,
  changePassword: `${API_BASE_URL}/api/auth/change-password`,
  recoverPassword: `${API_BASE_URL}/api/auth/recover-password`,
};
