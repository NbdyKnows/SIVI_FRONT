import authService from './authService';
import { API_BASE_URL } from '../config/appConfig';
import { comprasEndpoints } from '../config/endpoints/comprasEndpoints';

const comprasService = {

  _getHeaders: () => {
    const token = authService.getAccessToken();
    if (!token || token === 'local_token') {
      throw new Error('Debes iniciar sesión para realizar operaciones de compra.');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  _request: async (endpoint, options = {}) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || `Error ${response.status}`);
        } catch (e) {
          if (e.message.startsWith('Error')) throw e;
          throw new Error(`Error del servidor (${response.status}): ${errorText}`);
        }
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        return await response.text();
      }

    } catch (error) {
      console.error('Error en comprasService:', error);
      throw error;
    }
  },

  /**
   * Registrar una nueva Orden de Compra (Estado: Pendiente)
   * @param {Object} compraDTO - Estructura: { idUsuario, idProveedor, detalles: [...] }
   */
  registrarCompra: async (compraDTO) => {
    return comprasService._request(comprasEndpoints.registrar, {
      method: 'POST',
      headers: comprasService._getHeaders(),
      body: JSON.stringify(compraDTO)
    });
  },

  /**
   * Aprobar una Orden de Compra
   * @param {number} idOrden
   */
  aprobarCompra: async (idOrden) => {
    return comprasService._request(comprasEndpoints.aprobar(idOrden), {
      method: 'PUT',
      headers: comprasService._getHeaders()
    });
  },

  /**
   * Listar todas las ordenes habilitadas
   */
  listarCompras: async () => {
    return comprasService._request(comprasEndpoints.lista, {
      method: 'GET',
      headers: comprasService._getHeaders()
    });
  },

  /**
   * Buscar una orden por ID
   */
  buscarPorId: async (id) => {
    return comprasService._request(comprasEndpoints.buscarPorId(id), {
      method: 'GET',
      headers: comprasService._getHeaders()
    });
  },

  /**
   * Anular una orden
   */
  anularCompra: async (id) => {
    return comprasService._request(comprasEndpoints.deshabilitar(id), {
      method: 'PUT',
      headers: comprasService._getHeaders()
    });
  }
};

export default comprasService;