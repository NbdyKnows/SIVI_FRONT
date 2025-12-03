import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Filter,
  FileDown,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  PieChart,
  Scale,
  AlertCircle
} from 'lucide-react';
import reportesService from '../../services/reportesService';

const getPresetDates = (preset) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  if (preset === 'thisMonth') {
    start.setDate(1);
  } else if (preset === 'lastMonth') {
    start.setMonth(start.getMonth() - 1);
    start.setDate(1);

    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    end.setTime(lastDayLastMonth.getTime());
  } else if (preset === 'thisYear') {
    start.setMonth(0, 1);
  }

  const toISODate = (date) => date.toISOString().split('T')[0];
  return { fechaInicio: toISODate(start), fechaFin: toISODate(end) };
};

const ModalReporteFinanciero = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    tipoReporte: 'ganancias_perdidas',
    fechaInicio: '',
    fechaFin: '',
    tipoFormato: 'pdf'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const dates = getPresetDates('thisMonth');
      setFormData({
        tipoReporte: 'ganancias_perdidas',
        fechaInicio: dates.fechaInicio,
        fechaFin: dates.fechaFin,
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (errors.form) setErrors(prev => ({ ...prev, form: null }));
  };

  const handleSetPreset = (preset) => {
    const { fechaInicio, fechaFin } = getPresetDates(preset);
    setFormData(prev => ({ ...prev, fechaInicio, fechaFin }));
    setErrors(prev => ({ ...prev, fechaInicio: null, fechaFin: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    if (!formData.fechaFin) newErrors.fechaFin = 'La fecha de fin es obligatoria';
    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
      newErrors.fechaFin = 'La fecha final no puede ser anterior a la inicial';
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
      await reportesService.generarReporteFinanciero(formData);
      
      setSuccessMessage('Reporte descargado correctamente.');

    } catch (error) {
      console.error("Error generando reporte:", error);
      setErrors({ form: error.message || 'Error al generar reporte. Intente nuevamente.' });
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

        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: PRIMARY_GREEN }}>
              Reportes Financieros
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Estados de cuenta, balances y análisis de gastos.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Tipo de Reporte
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoReporte: 'ganancias_perdidas' }))}
                style={{
                  borderColor: formData.tipoReporte === 'ganancias_perdidas' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoReporte === 'ganancias_perdidas' ? '#f0fdf4' : 'white'
                }}
                className="flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all hover:bg-gray-50"
              >
                <TrendingUp className="w-6 h-6 mb-2" style={{ color: formData.tipoReporte === 'ganancias_perdidas' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="text-xs font-medium text-center" style={{ color: formData.tipoReporte === 'ganancias_perdidas' ? PRIMARY_GREEN : '#374151' }}>Ganancias y Pérdidas</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoReporte: 'gastos' }))}
                style={{
                  borderColor: formData.tipoReporte === 'gastos' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoReporte === 'gastos' ? '#f0fdf4' : 'white'
                }}
                className="flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all hover:bg-gray-50"
              >
                <PieChart className="w-6 h-6 mb-2" style={{ color: formData.tipoReporte === 'gastos' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="text-xs font-medium text-center" style={{ color: formData.tipoReporte === 'gastos' ? PRIMARY_GREEN : '#374151' }}>Detalle de Gastos</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoReporte: 'balance' }))}
                style={{
                  borderColor: formData.tipoReporte === 'balance' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoReporte === 'balance' ? '#f0fdf4' : 'white'
                }}
                className="flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all hover:bg-gray-50"
              >
                <Scale className="w-6 h-6 mb-2" style={{ color: formData.tipoReporte === 'balance' ? PRIMARY_GREEN : '#9ca3af' }} />
                <span className="text-xs font-medium text-center" style={{ color: formData.tipoReporte === 'balance' ? PRIMARY_GREEN : '#374151' }}>Balance General</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <Calendar className="w-5 h-5 inline mr-2" />
              Periodo Contable
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={() => handleSetPreset('thisMonth')} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Este Mes</button>
              <button type="button" onClick={() => handleSetPreset('lastMonth')} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Mes Pasado</button>
              <button type="button" onClick={() => handleSetPreset('thisYear')} className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Todo el Año</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Desde</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600"
                />
                {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Hasta</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600"
                />
                {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold mb-3 text-gray-600">
              <Filter className="w-5 h-5 inline mr-2" />
              Formato
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoFormato: 'pdf' }))}
                style={{
                  borderColor: formData.tipoFormato === 'pdf' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoFormato === 'pdf' ? '#f0fdf4' : 'white',
                  color: formData.tipoFormato === 'pdf' ? PRIMARY_GREEN : '#4b5563'
                }}
                className="flex items-center justify-center p-3 border rounded-lg gap-2 transition-colors"
              >
                <FileText className="w-5 h-5" /> PDF
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoFormato: 'excel' }))}
                style={{
                  borderColor: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#e5e7eb',
                  backgroundColor: formData.tipoFormato === 'excel' ? '#f0fdf4' : 'white',
                  color: formData.tipoFormato === 'excel' ? PRIMARY_GREEN : '#4b5563'
                }}
                className="flex items-center justify-center p-3 border rounded-lg gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-5 h-5" /> Excel
              </button>
            </div>
          </div>

          {errors.form && (
            <div className="flex items-center gap-2 justify-center p-3 bg-red-50 text-red-600 rounded-lg text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {errors.form}
            </div>
          )}
          
          {successMessage && (
            <div className="flex items-center gap-2 justify-center p-3 bg-green-50 text-green-700 rounded-lg text-sm animate-fade-in">
              <FileDown className="w-4 h-4" />
              {successMessage}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: isLoading ? '#CCCCCC' : PRIMARY_GREEN }}
              className={`
                px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-sm
                ${isLoading ? 'cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generando...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Generar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalReporteFinanciero;