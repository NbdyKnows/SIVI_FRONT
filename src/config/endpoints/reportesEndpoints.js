import { API_BASE_URL } from '../apiConfig';

export const reportesEndpoints = {
  ventasPorProducto: `${API_BASE_URL}/reportes/ventas-producto/reporte`,
  ventasPorComprobante: `${API_BASE_URL}/reportes/ventas-comprobante/reporte`,
  inventario: `${API_BASE_URL}/reportes/inventario/reporte`,
  financiero: `${API_BASE_URL}/reportes/financiero/reporte`,
  productos: `${API_BASE_URL}/reportes/productos`,
  general: `${API_BASE_URL}/reportes/general`,
};