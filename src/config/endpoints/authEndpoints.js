/**
 * Endpoints de Autenticación
 */

import { API_BASE_URL } from '../appConfig';

export const authEndpoints = {
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  verify: `${API_BASE_URL}/auth/verify`,
  refresh: `${API_BASE_URL}/auth/refresh`,
  changePassword: `${API_BASE_URL}/auth/change-password`,
  recoverPassword: `${API_BASE_URL}/auth/recover-password`,
};
