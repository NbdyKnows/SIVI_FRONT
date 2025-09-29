import React from 'react';
import { FileText, Calendar, User, ArrowLeft } from 'lucide-react';

const ComprobantePago = ({
  productosVenta,
  subtotal,
  igv,
  descuentos,
  descuentoFidelidad,
  total,
  metodoPago,
  setMetodoPago,
  clienteDNI,
  abrirModalCliente,
  procesarVenta
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 h-fit w-full">
      <div className="flex items-center mb-3">
        <FileText className="w-4 h-4 mr-2" style={{ color: '#633416' }} />
        <h3 className="text-sm sm:text-base font-semibold" style={{ color: '#633416' }}>Comprobante de Pago</h3>
      </div>

      <div className="space-y-4">
        {/* Desglose completo de totales como en la imagen */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span style={{ color: '#666666' }}>Subtotal S/</span>
            <span style={{ color: '#000000' }}>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span style={{ color: '#666666' }}>IGV S/</span>
            <span style={{ color: '#000000' }}>{igv.toFixed(2)}</span>
          </div>
          {/* Descuentos por productos */}
          {descuentos > 0 && (
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span style={{ color: '#666666' }}>Desc. Productos (-) S/</span>
              <span style={{ color: '#F59E0B' }}>{descuentos.toFixed(2)}</span>
            </div>
          )}
          
          {/* Descuento de fidelidad */}
          {descuentoFidelidad && descuentoFidelidad.porcentaje > 0 && (
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span style={{ color: '#666666' }}>Desc. Fidelidad ({descuentoFidelidad.porcentaje}%) (-) S/</span>
              <span style={{ color: '#F59E0B' }}>{descuentoFidelidad.monto.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-t border-b font-semibold" style={{ borderColor: '#CCCCCC' }}>
            <span style={{ color: '#633416' }}>Total S/</span>
            <span className="text-lg font-bold" style={{ color: '#3F7416' }}>{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Información de pago */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="block mb-1 text-xs font-medium" style={{ color: '#666666' }}>Método de Pago</label>
              <select 
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full p-2 border rounded text-xs focus:outline-none focus:ring-1"
                style={{ borderColor: '#CCCCCC', '--tw-ring-color': '#3F7416' }}
              >
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Yape/Plin</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium" style={{ color: '#666666' }}>Fecha</label>
              <div className="flex items-center text-sm py-2">
                <Calendar className="w-4 h-4 mr-1" style={{ color: '#666666' }} />
                <span style={{ color: '#3F7416' }}>28/09/2025</span>
              </div>
            </div>
          </div>


        </div>

        {/* Botones de acción centralizados */}
        <div className="space-y-3 pt-3 border-t" style={{ borderColor: '#CCCCCC' }}>
          {/* Botón Cliente */}
          <button 
            onClick={abrirModalCliente}
            className="w-full py-2 px-3 rounded font-medium transition-colors text-sm flex items-center justify-center"
            style={{ 
              backgroundColor: clienteDNI ? '#3F7416' : 'transparent',
              border: `1px solid #3F7416`,
              color: clienteDNI ? '#FFFFFF' : '#3F7416'
            }}
            onMouseEnter={(e) => {
              if (!clienteDNI) {
                e.target.style.backgroundColor = '#F9F9F9';
              } else {
                e.target.style.backgroundColor = '#2F5A10';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = clienteDNI ? '#3F7416' : 'transparent';
            }}
          >
            <User className="w-4 h-4 mr-2" />
            {clienteDNI ? `Cliente: ${clienteDNI}` : 'Cliente'}
          </button>

          {/* Botones Atrás y Guardar */}
          <div className="flex space-x-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-4 py-2 border rounded-lg font-medium transition-colors text-sm"
              style={{ borderColor: '#CCCCCC', color: '#666666' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </button>
            <button
              onClick={procesarVenta}
              className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
              style={{ backgroundColor: '#3F7416' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2F5A10'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416'}
              disabled={productosVenta.length === 0}
            >
              Generar Comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprobantePago;