import axios from 'axios';
import { API_TIMEOUT } from '../config/apiConfig';
import { reportesEndpoints } from '../config/endpoints/reportesEndpoints';
import authService from './authService';

const descargarArchivo = (response, nombreDefecto) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  let nombreArchivo = nombreDefecto;
  const contentDisposition = response.headers['content-disposition'];
  
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[2]) {
      nombreArchivo = match[2];
    }
  }

  link.setAttribute('download', nombreArchivo);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generarReporteDeVentas = async (opciones) => {
  const { tipoReporte, tipoFormato, fechaInicio, fechaFin } = opciones;
  const token = authService.getAccessToken();

  if (!token) {
    alert("No hay sesión activa. Por favor inicia sesión nuevamente.");
    return;
  }

  let url = '';
  let nombreArchivo = `Reporte_Ventas_${fechaInicio}_al_${fechaFin}.${tipoFormato === 'excel' ? 'xlsx' : 'pdf'}`;

  if (tipoReporte === 'por_producto') {
    url = reportesEndpoints.ventasPorProducto;
  } else {
    url = reportesEndpoints.ventasPorComprobante;
  }

  try {
    console.log(`Generando reporte en: ${url}`);
    
    const response = await axios.get(url, {
      params: {
        formato: tipoFormato,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      },
      responseType: 'blob',
      timeout: API_TIMEOUT || 15000,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    descargarArchivo(response, nombreArchivo);
    return true;

  } catch (error) {
    console.error('Error en servicio de reportes:', error);
    
    if (error.response && error.response.status === 403) {
        alert("Acceso denegado (403). Tu usuario no tiene permisos.");
    } else {
        alert("Error al generar el reporte de ventas.");
    }
    throw error;
  }
};

export const generarReporteInventario = async (opciones) => {
  const { tipoReporte, tipoFormato, fechaInicio, fechaFin } = opciones;
  const token = authService.getAccessToken();

  if (!token) {
    alert("No hay sesión activa.");
    return;
  }

  const url = reportesEndpoints.inventario;
  const params = { formato: tipoFormato };
  let nombreArchivo = `Reporte_Inventario.${tipoFormato === 'excel' ? 'xlsx' : 'pdf'}`;

  if (tipoReporte === 'movimientos') {
    if (fechaInicio && fechaFin) {
        params.fechaInicio = fechaInicio;
        params.fechaFin = fechaFin;
        nombreArchivo = `Reporte_Movimientos_${fechaInicio}_al_${fechaFin}.${tipoFormato === 'excel' ? 'xlsx' : 'pdf'}`;
    } else {
        alert("Debes seleccionar un rango de fechas.");
        return;
    }
  } else {
    nombreArchivo = `Reporte_Stock_Actual.${tipoFormato === 'excel' ? 'xlsx' : 'pdf'}`;
  }

  try {
    console.log(`Generando reporte inventario en: ${url}`, params);
    
    const response = await axios.get(url, {
      params: params,
      responseType: 'blob',
      timeout: API_TIMEOUT || 15000,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    descargarArchivo(response, nombreArchivo);
    return true;

  } catch (error) {
    console.error('Error en reporte inventario:', error);
    if (error.response && error.response.status === 403) {
        alert("Acceso denegado (403).");
    } else {
        alert("Error al generar el reporte de inventario.");
    }
    throw error;
  }
};

export const generarReporteFinanciero = async (opciones) => {
  const { tipoReporte, tipoFormato, fechaInicio, fechaFin } = opciones;
  const token = authService.getAccessToken();

  if (!token) {
    alert("No hay sesión activa.");
    return;
  }

  const url = reportesEndpoints.financiero;
  const params = {
    formato: tipoFormato,
    tipo: tipoReporte,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin
  };

  if (!fechaInicio || !fechaFin) {
      alert("El reporte financiero requiere un periodo contable (fechas).");
      return;
  }

  let nombreArchivo = `Reporte_Financiero_${tipoReporte}_${fechaInicio}.${tipoFormato === 'excel' ? 'xlsx' : 'pdf'}`;

  try {
    console.log(`Solicitando reporte financiero a: ${url}`, params);
    
    const response = await axios.get(url, {
      params: params,
      responseType: 'blob',
      timeout: API_TIMEOUT || 20000,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    descargarArchivo(response, nombreArchivo);
    return true;

  } catch (error) {
    console.error("Error financiero:", error);
    if (error.response && error.response.status === 403) {
        alert("Acceso denegado. Solo ADMIN tiene acceso a financieros.");
    } else {
        alert("Error al generar reporte financiero.");
    }
    throw error;
  }
};