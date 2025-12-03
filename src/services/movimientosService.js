// services/movimientosService.js
import httpClient from './httpClient';
import { movimientosEndpoints } from '../config/api';

const movimientosService = {
  /**
   * Obtener lista de movimientos
   * GET /movimientos/ListaMovimientos?entradaSalida=0
   * @param {number} entradaSalida - 0=ENTRADAS, 1=SALIDAS
   */
  async getAll(entradaSalida = 0) {
    try {
      console.log('📡 Obteniendo movimientos...');
      const response = await httpClient.get(
        movimientosEndpoints.getAll(entradaSalida)
      );
      console.log('✅ Movimientos recibidos:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener movimientos:', error);
      throw error;
    }
  },
 
   /**
   * Obtener un movimiento completo por ID (con detalles)
   * GET /movimientos/{id}
   */
  async getById(id) {
    try {
      console.log(`📡 Obteniendo movimiento ${id}...`);
      const response = await httpClient.get(
        movimientosEndpoints.getById(id)
      );
      console.log(`✅ Movimiento ${id} recibido:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Error al obtener movimiento ${id}:`, error);
      throw error;
    }
  },
  /**
   * Crear un nuevo movimiento
   * POST /movimientos
   * @param {Object} movimientoData - Datos del movimiento
   * @returns {Promise} Movimiento creado
   */
  async create(movimientoData) {
    try {
      console.log('📤 Enviando nuevo movimiento:', movimientoData);
      
      const response = await httpClient.post(
        movimientosEndpoints.create,
        movimientoData
      );
      
      console.log('✅ Movimiento creado exitosamente:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Error al crear movimiento:', error);
      
      // Manejo de errores específicos
      let mensajeError = 'Error al crear el movimiento';
      
      if (error.response) {
        if (error.response.status === 400) {
          mensajeError = 'Datos inválidos. Verifica los campos.';
        } else if (error.response.status === 500) {
          mensajeError = 'Error del servidor. Intenta nuevamente.';
        }
        // Puedes mostrar el mensaje del backend si existe
        if (error.response.data?.message) {
          mensajeError = error.response.data.message;
        }
      }
      
      throw new Error(mensajeError);
    }
  }
};

export default movimientosService;