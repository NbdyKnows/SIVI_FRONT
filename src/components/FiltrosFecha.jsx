import React from 'react';
import { Search, X } from 'lucide-react';

const FiltrosFecha = ({ 
  fechaDesde, 
  fechaHasta, 
  onFechaDesdeChange, 
  onFechaHastaChange,
  onAplicarFiltros,
  onLimpiarFiltros
}) => {
  const hasDateError = fechaDesde && fechaHasta && new Date(fechaDesde) > new Date(fechaHasta);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Campo Fecha Desde */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium mb-1" style={{ color: '#666666' }}>
            Fecha Desde
            <span className="text-xs" style={{ color: '#CCCCCC' }}> (00:00:00)</span>
          </label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1"
            style={{ 
              borderColor: hasDateError ? '#ff6b6b' : '#CCCCCC', 
              '--tw-ring-color': '#3F7416' 
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onAplicarFiltros();
              }
            }}
          />
          {hasDateError && (
            <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>
              La fecha "Desde" no puede ser mayor que "Hasta"
            </p>
          )}
        </div>

        {/* Campo Fecha Hasta */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium mb-1" style={{ color: '#666666' }}>
            Fecha Hasta
            <span className="text-xs" style={{ color: '#CCCCCC' }}> (23:59:59)</span>
          </label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => onFechaHastaChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1"
            style={{ 
              borderColor: hasDateError ? '#ff6b6b' : '#CCCCCC', 
              '--tw-ring-color': '#3F7416' 
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onAplicarFiltros();
              }
            }}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={onAplicarFiltros}
            disabled={hasDateError}
            className="px-4 py-2 text-sm text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: hasDateError ? '#CCCCCC' : '#3F7416'
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#2F5A10';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#3F7416';
              }
            }}
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>

          {(fechaDesde || fechaHasta) && (
            <button
              onClick={onLimpiarFiltros}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltrosFecha;