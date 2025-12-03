import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Filter,
  AlertCircle,
  FileDown,
  FileText,
  FileSpreadsheet,
  Archive,
  List
} from 'lucide-react';
import reportesService from '../../services/reportesService';

const getPresetDates = (preset) => {
  const end = new Date();
  const start = new Date();
  if (preset === '7days') start.setDate(start.getDate() - 6);
  else if (preset === '30days') start.setDate(start.getDate() - 29);
  else if (preset === 'month') start.setDate(1);
  const toISODate = (date) => date.toISOString().split('T')[0];
  return { fechaInicio: toISODate(start), fechaFin: toISODate(end) };
};

const ModalReporteInventario = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    tipoReporte: 'stock_actual',
    categoriaId: 'todas',
    fechaInicio: '',
    fechaFin: '',
    tipoFormato: 'pdf'
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = getPresetDates('month');
      setFormData({
        tipoReporte: 'stock_actual',
        categoriaId: 'todas',
        fechaInicio: today.fechaInicio,
        fechaFin: today.fechaFin,
        tipoFormato: 'pdf'
      });
      setErrors({});
      setSuccessMessage('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.form) setErrors(prev => ({ ...prev, form: null }));
  };
  
  const handleSetPreset = (preset) => {
    const { fechaInicio, fechaFin } = getPresetDates(preset);
    setFormData(prev => ({ ...prev, fechaInicio, fechaFin }));
    setErrors(prev => ({ ...prev, fechaInicio: null, fechaFin: null }));
  };

  const validateForm = () => {
    const newErrors = {};
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
    setErrors({});
    setSuccessMessage('');
    
    try {
      const opciones = { ...formData };
      if (opciones.tipoReporte === 'stock_actual') {
        delete opciones.fechaInicio;
        delete opciones.fechaFin;
      }
      await reportesService.generarReporteInventario(opciones);
      
      setSuccessMessage('Reporte generado y descargado con éxito.');
      
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setErrors({ form: error.message || 'No se pudo generar el reporte. Intente de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  if (!isOpen) return null;

  const mostrarFechas = formData.tipoReporte === 'movimientos';
  const PRIMARY_GREEN = '#3F7416';
  const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ backgroundColor: OVERLAY_COLOR }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform animate-scale-in"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: PRIMARY_GREEN }}>
              Reportes de Inventario
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Stock actual, historial de movimientos y valoración.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <Archive className="w-5 h-5 inline mr-2" />
              Tipo de Reporte
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, tipoReporte: 'stock_actual'}))}
                    className={`p-3 border rounded-lg text-center transition-all ${formData.tipoReporte === 'stock_actual' ? 'bg-green-50 border-green-600 text-green-800 font-medium ring-1 ring-green-600' : 'hover:bg-gray-50'}`}
                >
                    Stock Actual
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, tipoReporte: 'movimientos'}))}
                    className={`p-3 border rounded-lg text-center transition-all ${formData.tipoReporte === 'movimientos' ? 'bg-green-50 border-green-600 text-green-800 font-medium ring-1 ring-green-600' : 'hover:bg-gray-50'}`}
                >
                    Movimientos
                </button>
            </div>
          </div>
          {mostrarFechas && (
            <div className="space-y-4 animate-fade-in bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Rango de Fechas
                    </label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => handleSetPreset('7days')} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100">7 días</button>
                        <button type="button" onClick={() => handleSetPreset('month')} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100">Mes</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fechaInicioInv" className="block text-xs font-medium mb-1 text-gray-500">Desde</label>
                    <input
                    type="date"
                    id="fechaInicioInv"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 bg-white"
                    disabled={isLoading}
                    />
                    {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>}
                </div>
                <div>
                    <label htmlFor="fechaFinInv" className="block text-xs font-medium mb-1 text-gray-500">Hasta</label>
                    <input
                    type="date"
                    id="fechaFinInv"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 bg-white"
                    disabled={isLoading}
                    />
                    {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>}
                </div>
                </div>
            </div>
          )}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <Filter className="w-5 h-5 inline mr-2" />
              Formato de Salida
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoFormato: 'pdf'}))}
                disabled={isLoading}
                style={{ 
                  borderColor: formData.tipoFormato === 'pdf' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoFormato === 'pdf' ? '#f0fdf4' : 'white',
                  color: formData.tipoFormato === 'pdf' ? PRIMARY_GREEN : '#4b5563'
                }}
                className="flex items-center justify-center p-3 border rounded-lg gap-2 transition-all hover:shadow-sm"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoFormato: 'excel'}))}
                disabled={isLoading}
                style={{ 
                  borderColor: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoFormato === 'excel' ? '#f0fdf4' : 'white',
                  color: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#4b5563'
                }}
                className="flex items-center justify-center p-3 border rounded-lg gap-2 transition-all hover:shadow-sm"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-medium">Excel</span>
              </button>
            </div>
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.form}
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center justify-center gap-2">
                <FileDown className="w-4 h-4" /> {successMessage}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: isLoading ? '#CCCCCC' : PRIMARY_GREEN }}
              className={`
                px-5 py-2.5 text-white rounded-lg transition-colors flex items-center gap-2 font-medium text-sm shadow-sm
                ${isLoading ? 'cursor-not-allowed' : 'hover:opacity-90'}
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Descargar Reporte
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