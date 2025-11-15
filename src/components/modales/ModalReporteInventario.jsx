import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Filter, 
  AlertCircle, 
  FileDown, 
  FileText, 
  FileSpreadsheet,
  Archive, // Icono para Inventario
  List // Icono para Categoría
} from 'lucide-react';

// (La función getPresetDates la copiaríamos aquí si la usamos,
// pero la haremos visible/invisible condicionalmente)
const getPresetDates = (preset) => {
  const end = new Date();
  const start = new Date();
  if (preset === '7days') start.setDate(start.getDate() - 6);
  else if (preset === '30days') start.setDate(start.getDate() - 29);
  else if (preset === 'month') start.setDate(1);
  const toISODate = (date) => date.toISOString().split('T')[0];
  return { fechaInicio: toISODate(start), fechaFin: toISODate(end) };
};


const ModalReporteInventario = ({ isOpen, onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    tipoReporte: 'stock_actual', // 'stock_actual' vs 'movimientos'
    categoriaId: 'todas',
    fechaInicio: '',
    fechaFin: '',
    tipoFormato: 'pdf'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para resetear el formulario
  useEffect(() => {
    if (isOpen) {
      const today = getPresetDates('today');
      setFormData({
        tipoReporte: 'stock_actual',
        categoriaId: 'todas',
        fechaInicio: today.fechaInicio, // Por defecto, aunque esté oculto
        fechaFin: today.fechaFin,
        tipoFormato: 'pdf'
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSetPreset = (preset) => {
    const { fechaInicio, fechaFin } = getPresetDates(preset);
    setFormData(prev => ({ ...prev, fechaInicio, fechaFin }));
    setErrors(prev => ({ ...prev, fechaInicio: null, fechaFin: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Solo valida las fechas SI el tipo de reporte es 'movimientos'
    if (formData.tipoReporte === 'movimientos') {
      if (!formData.fechaInicio) {
        newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
      }
      if (!formData.fechaFin) {
        newErrors.fechaFin = 'La fecha de fin es obligatoria';
      }
      if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
        newErrors.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Pasamos una copia de los datos
      // Si es 'stock_actual', las fechas no importan
      const opciones = { ...formData };
      if (opciones.tipoReporte === 'stock_actual') {
        delete opciones.fechaInicio;
        delete opciones.fechaFin;
      }
      await onGenerate(opciones); 
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setErrors({ form: 'No se pudo generar el reporte. Intente de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  if (!isOpen) return null;

  // Variable para saber si mostrar las fechas
  const mostrarFechas = formData.tipoReporte === 'movimientos';

  return (
    <div 
      className="fixed inset-0 bg-primary-green-alpha backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-primary-green">
              Generar Reporte de Inventario
            </h2>
            <p className="text-sm text-secondary-dark-gray mt-1">
              Selecciona las opciones para tu reporte de inventario.
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
          
          {/* --- Tipo de Reporte --- */}
          <div>
            <label className="block text-base font-semibold mb-3 text-secondary-dark-gray">
              <Archive className="w-5 h-5 inline mr-2" />
              Tipo de Reporte
            </label>
            <select
              name="tipoReporte"
              value={formData.tipoReporte}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 border-gray-300 focus:ring-states-focus focus:border-states-focus"
              disabled={isLoading}
            >
              <option value="stock_actual">Stock Actual</option>
              <option value="movimientos">Historial de Movimientos</option>
            </select>
          </div>

          {/* --- Rango de Fechas (Condicional) --- */}
          {/* Usamos 'hidden' y 'animate-fadeIn' para mostrar/ocultar */}
          <div className={`space-y-4 ${mostrarFechas ? 'animate-fadeIn' : 'hidden'}`}>
            <label className="block text-base font-semibold text-secondary-dark-gray">
              <Calendar className="w-5 h-5 inline mr-2" />
              Rango de Fechas (para Movimientos)
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleSetPreset('7days')} className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors" disabled={isLoading}>Últimos 7 días</button>
              <button type="button" onClick={() => handleSetPreset('30days')} className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors" disabled={isLoading}>Últimos 30 días</button>
              <button type="button" onClick={() => handleSetPreset('month')} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" disabled={isLoading}>Este Mes</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaInicioInv" className="block text-sm font-medium mb-1 text-gray-600">Desde *</label>
                <input
                  type="date"
                  id="fechaInicioInv" // ID único
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.fechaInicio ? 'border-red-300' : 'border-gray-300'} focus:ring-states-focus focus:border-states-focus`}
                  disabled={isLoading}
                />
                {errors.fechaInicio && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fechaInicio}</p>}
              </div>
              <div>
                <label htmlFor="fechaFinInv" className="block text-sm font-medium mb-1 text-gray-600">Hasta *</label>
                <input
                  type="date"
                  id="fechaFinInv" // ID único
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

          {/* --- Filtro por Categoría --- */}
          <div>
            <label className="block text-base font-semibold mb-3 text-secondary-dark-gray">
              <List className="w-5 h-5 inline mr-2" />
              Filtrar por Categoría
            </label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 border-gray-300 focus:ring-states-focus focus:border-states-focus"
              disabled={isLoading}
            >
              <option value="todas">Todas las categorías</option>
              {/* (Estos datos vendrían de tu API eventualmente) */}
              <option value="1">Bebidas</option>
              <option value="2">Abarrotes</option>
              <option value="3">Limpieza</option>
            </select>
          </div>

          {/* --- Formato de Salida --- */}
          <div>
            <label className="block text-base font-semibold mb-3 text-secondary-dark-gray">
              <Filter className="w-5 h-5 inline mr-2" />
              Formato de Salida
            </label>
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

export default ModalReporteInventario;