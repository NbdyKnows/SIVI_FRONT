import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Filter,
  AlertCircle,
  FileDown,
  FileText,
  FileSpreadsheet,
  BarChart3,
  Package,
  Receipt
} from 'lucide-react';
import reportesService from '../../services/reportesService';

const getPresetDates = (preset) => {
  const end = new Date();
  const start = new Date();
  
  if (preset === 'today') {
    // start es hoy por defecto
  } else if (preset === '7days') {
    start.setDate(start.getDate() - 6);
  } else if (preset === '30days') {
    start.setDate(start.getDate() - 29);
  } else if (preset === 'month') {
    start.setDate(1);
  }
  
  const toISODate = (date) => date.toISOString().split('T')[0];
  return { fechaInicio: toISODate(start), fechaFin: toISODate(end) };
};

const ModalReporteVentas = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    tipoReporte: 'por_producto',
    fechaInicio: '',
    fechaFin: '',
    tipoFormato: 'pdf'
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = getPresetDates('today');
      setFormData({
        tipoReporte: 'por_producto',
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
    setFormData(prev => ({
      ...prev,
      fechaInicio,
      fechaFin
    }));
    setErrors(prev => ({ ...prev, fechaInicio: null, fechaFin: null }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await reportesService.generarReporteDeVentas(formData);
      
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
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: PRIMARY_GREEN }}>
              Generar Reporte de Ventas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona el tipo de reporte, rango de fechas y formato.
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
          
          {/* TIPO DE REPORTE */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Tipo de Reporte
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoReporte: 'por_producto'}))}
                disabled={isLoading}
                style={{
                  borderColor: formData.tipoReporte === 'por_producto' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoReporte === 'por_producto' ? '#f0fdf4' : 'white'
                }}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all hover:bg-gray-50
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Package className="w-8 h-8" style={{ color: formData.tipoReporte === 'por_producto' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="mt-2 text-sm font-medium text-center" style={{ color: formData.tipoReporte === 'por_producto' ? PRIMARY_GREEN : '#374151' }}>
                  Por Producto
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoReporte: 'por_comprobante'}))}
                disabled={isLoading}
                style={{
                  borderColor: formData.tipoReporte === 'por_comprobante' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoReporte === 'por_comprobante' ? '#f0fdf4' : 'white'
                }}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all hover:bg-gray-50
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Receipt className="w-8 h-8" style={{ color: formData.tipoReporte === 'por_comprobante' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="mt-2 text-sm font-medium text-center" style={{ color: formData.tipoReporte === 'por_comprobante' ? PRIMARY_GREEN : '#374151' }}>
                  Por Comprobante
                </span>
              </button>
            </div>
          </div>

          {/* Sección Fechas */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <Calendar className="w-5 h-5 inline mr-2" />
              Rango de Fechas
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {['today', '7days', '30days', 'month'].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSetPreset(preset)}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
                >
                  {preset === 'today' ? 'Hoy' : preset === '7days' ? 'Últimos 7 días' : preset === '30days' ? 'Últimos 30 días' : 'Este Mes'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaInicio" className="block text-sm font-medium mb-1 text-gray-600">Desde *</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                  disabled={isLoading}
                />
                {errors.fechaFin && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fechaFin}</p>}
              </div>
            </div>
          </div>

          {/* Sección Formato */}
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
                  backgroundColor: formData.tipoFormato === 'pdf' ? '#f0fdf4' : 'white'
                }}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all hover:bg-gray-50
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FileText className="w-10 h-10" style={{ color: formData.tipoFormato === 'pdf' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="mt-2 font-medium" style={{ color: formData.tipoFormato === 'pdf' ? PRIMARY_GREEN : '#374151' }}>PDF</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, tipoFormato: 'excel'}))}
                disabled={isLoading}
                style={{
                  borderColor: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoFormato === 'excel' ? '#f0fdf4' : 'white'
                }}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all hover:bg-gray-50
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FileSpreadsheet className="w-10 h-10" style={{ color: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="mt-2 font-medium" style={{ color: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#374151' }}>Excel (.xlsx)</span>
              </button>
            </div>
          </div>
          
          {/* Mensajes */}
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

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: isLoading ? '#CCCCCC' : PRIMARY_GREEN }}
              className={`
                px-5 py-2.5 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-sm
                hover:opacity-90 
                ${isLoading ? 'cursor-not-allowed' : ''}
              `}
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