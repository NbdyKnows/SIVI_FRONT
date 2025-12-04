import authService from './authService';
import { API_BASE_URL } from '../config/appConfig';
import { reportesEndpoints } from '../config/endpoints/reportesEndpoints';

const _descargar = async (endpoint, params, nombreBase) => {
  try {
    const token = authService.getAccessToken();
    
    if (!token || token === 'local_token') {
      throw new Error('Debes iniciar sesión para descargar reportes reales.');
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    console.log(`Solicitando reporte a: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Acceso Denegado: No tienes permisos para ver este reporte.');
      }
      const errorText = await response.text();
      throw new Error(`Error del servidor: ${errorText || response.statusText}`);
    }

    const blob = await response.blob();
    
    let nombreArchivo = nombreBase;
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.includes('filename=')) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        nombreArchivo = matches[1].replace(/['"]/g, '');
      }
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return true;

  } catch (error) {
    console.error('Error descargando reporte:', error);
    throw error;
  }
};

export const generarReporteDeVentas = async (opciones) => {
  const { tipoReporte, tipoFormato, fechaInicio, fechaFin } = opciones;
  
  const endpoint = tipoReporte === 'por_producto'
    ? reportesEndpoints.ventasPorProducto
    : reportesEndpoints.ventasPorComprobante;

  const ext = tipoFormato === 'excel' ? 'xlsx' : 'pdf';
  const nombre = `Reporte_Ventas_${tipoReporte}.${ext}`;

  return _descargar(endpoint, {
    formato: tipoFormato,
    fechaInicio,
    fechaFin
  }, nombre);
};

export const generarReporteInventario = async (opciones) => {
  const { tipoReporte, tipoFormato, fechaInicio, fechaFin } = opciones;
  const ext = tipoFormato === 'excel' ? 'xlsx' : 'pdf';
  
  const params = { formato: tipoFormato };
  let nombre = `Reporte_Inventario_Stock.${ext}`;

  if (tipoReporte === 'movimientos') {
    if (!fechaInicio || !fechaFin) {
      throw new Error("Para el reporte de movimientos se requiere un rango de fechas.");
    }
    params.fechaInicio = fechaInicio;
    params.fechaFin = fechaFin;
    nombre = `Reporte_Movimientos_${fechaInicio}_${fechaFin}.${ext}`;
  }

  return _descargar(reportesEndpoints.inventario, params, nombre);
};

export const generarReporteFinanciero = async (opciones) => {
  const { tipoReporte, tipoFormato, fechaInicio, fechaFin } = opciones;
  const ext = tipoFormato === 'excel' ? 'xlsx' : 'pdf';

  if (!fechaInicio || !fechaFin) {
    throw new Error("Los reportes financieros requieren un periodo contable (fechas).");
  }
  
  const nombre = `Financiero_${tipoReporte}.${ext}`;

  return _descargar(reportesEndpoints.financiero, {
    tipo: tipoReporte,
    formato: tipoFormato,
    fechaInicio,
    fechaFin
  }, nombre);
};

const reportesService = {
  generarReporteDeVentas,
  generarReporteInventario,
  generarReporteFinanciero
};

<<<<<<< HEAD
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

const reportesService = {
  generarReporteDeVentas,
  generarReporteInventario,
  generarReporteFinanciero,
};

=======
>>>>>>> master
export default reportesService;