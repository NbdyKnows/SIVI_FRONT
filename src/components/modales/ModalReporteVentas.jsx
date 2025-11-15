import React, { useState, useEffect } from 'react';
// Añadimos iconos para PDF (FileText) y Excel (FileSpreadsheet)
import { 
  X, 
  Calendar, 
  Filter, 
  AlertCircle, 
  FileDown, 
  FileText, 
  FileSpreadsheet 
} from 'lucide-react';

// --- Función Helper para obtener fechas (puedes moverla fuera) ---
// Esta función genera los rangos de fechas para los botones preset
const getPresetDates = (preset) => {
  const end = new Date();
  const start = new Date();
  
  if (preset === 'today') {
    // No cambia nada, start y end son hoy
  } else if (preset === '7days') {
    start.setDate(start.getDate() - 6); // 6 días atrás + hoy = 7 días
  } else if (preset === '30days') {
    start.setDate(start.getDate() - 29); // 29 días atrás + hoy = 30 días
  } else if (preset === 'month') {
    start.setDate(1); // Primer día del mes actual
  }
  
  // Devuelve las fechas en formato YYYY-MM-DD
  const toISODate = (date) => date.toISOString().split('T')[0];
  return { fechaInicio: toISODate(start), fechaFin: toISODate(end) };
};
// -----------------------------------------------------------------


const ModalReporteVentas = ({ isOpen, onClose, onGenerate }) => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoFormato: 'pdf'
  });
  
  // Estado para los errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para el spinner
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para resetear el formulario cuando se abre
  useEffect(() => {
    if (isOpen) {
      // Al abrir, establece la fecha de "Hoy" por defecto
      const today = getPresetDates('today');
      setFormData({
        fechaInicio: today.fechaInicio,
        fechaFin: today.fechaFin,
        tipoFormato: 'pdf'
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]); // Se ejecuta solo cuando 'isOpen' cambia

  // Manejador para los inputs de fecha
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpia el error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Nueva función para manejar los clics en los botones de presets
  const handleSetPreset = (preset) => {
    const { fechaInicio, fechaFin } = getPresetDates(preset);
    setFormData(prev => ({
      ...prev,
      fechaInicio,
      fechaFin
    }));
    // Limpia errores de fecha si los había
    setErrors(prev => ({ ...prev, fechaInicio: null, fechaFin: null }));
  };

  // Lógica de validación (sin cambios)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    }
    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador del envío (sin cambios)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onGenerate(formData); // Llama a la función simulada/real del padre
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setErrors({ form: 'No se pudo generar el reporte. Intente de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador de cierre (sin cambios)
  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    // Fondo (Backdrop) con tu animación y color
    <div
      className="fixed inset-0 bg-primary-green-alpha backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleClose}
    >
      {/* Contenedor del Modal con tu animación */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header Mejorado */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-primary-green">
              Generar Reporte de Ventas
            </h2>
            <p className="text-sm text-secondary-dark-gray mt-1">
              Selecciona un rango de fechas y el formato deseado.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary-light-gray rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-secondary-dark-gray" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* --- SECCIÓN DE FECHAS MEJORADA --- */}
          <div>
            <label className="block text-base font-semibold mb-3 text-secondary-dark-gray">
              <Calendar className="w-5 h-5 inline mr-2" />
              Rango de Fechas
            </label>
            
            {/* Presets de Fechas */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={() => handleSetPreset('today')} className="px-3 py-1 text-xs font-medium text-primary-green bg-green-50 rounded-full hover:bg-green-100 transition-colors">Hoy</button>
              <button type="button" onClick={() => handleSetPreset('7days')} className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">Últimos 7 días</button>
              <button type="button" onClick={() => handleSetPreset('30days')} className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors">Últimos 30 días</button>
              <button type="button" onClick={() => handleSetPreset('month')} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Este Mes</button>
            </div>
            
            {/* Inputs de Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaInicio" className="block text-sm font-medium mb-1 text-gray-600">Desde *</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.fechaInicio ? 'border-red-300' : 'border-gray-300'} focus:ring-states-focus focus:border-states-focus`}
                  disabled={isLoading}
                />
                {errors.fechaInicio && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fechaInicio}</p>}
              </div>
              <div>
                <label htmlFor="fechaFin" className="block text-sm font-medium mb-1 text-gray-600">Hasta *</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.fechaFin ? 'border-red-300' : 'border-gray-300'} focus:ring-states-focus focus:border-states-focus`}
                  disabled={isLoading}
                />
                {errors.fechaFin && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fechaFin}</p>}
              </div>
            </div>
          </div>
          
          {/* --- SECCIÓN DE FORMATO MEJORADA --- */}
          <div>
            <label className="block text-base font-semibold mb-3 text-secondary-dark-gray">
              <Filter className="w-5 h-5 inline mr-2" />
              Formato de Salida
            </label>
            
            {/* Selector de Formato Visual */}
            <div className="grid grid-cols-2 gap-4">
              {/* Botón PDF */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoFormato: 'pdf'}))}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all
                            ${formData.tipoFormato === 'pdf'
                              ? 'border-primary-green bg-green-50' // Estado activo
                              : 'border-gray-300 bg-white hover:border-gray-400'} // Estado inactivo
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FileText className={`w-10 h-10 ${formData.tipoFormato === 'pdf' ? 'text-primary-green' : 'text-gray-500'}`} />
                <span className={`mt-2 font-medium ${formData.tipoFormato === 'pdf' ? 'text-primary-green' : 'text-gray-700'}`}>PDF</span>
              </button>
              
              {/* Botón Excel */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoFormato: 'excel'}))}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all
                            ${formData.tipoFormato === 'excel' 
                              ? 'border-primary-green bg-green-50' // Estado activo
                              : 'border-gray-300 bg-white hover:border-gray-400'} // Estado inactivo
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FileSpreadsheet className={`w-10 h-10 ${formData.tipoFormato === 'excel' ? 'text-primary-green' : 'text-gray-500'}`} />
                <span className={`mt-2 font-medium ${formData.tipoFormato === 'excel' ? 'text-primary-green' : 'text-gray-700'}`}>Excel (.xlsx)</span>
              </button>
            </div>
          </div>
          
          {/* Error general (si la API falla) */}
          {errors.form && <p className="text-red-500 text-sm text-center flex items-center gap-2 justify-center"><AlertCircle className="w-4 h-4" /> {errors.form}</p>}

          {/* Footer con Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-secondary-dark-gray bg-secondary-light-gray rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-white rounded-lg transition-colors flex items-center gap-2
                        bg-primary-green hover:bg-states-hover
                        disabled:bg-states-disabled disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalReporteVentas;