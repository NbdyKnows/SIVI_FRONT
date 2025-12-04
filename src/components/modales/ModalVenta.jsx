import React from 'react';
import { ArrowLeft, Printer, FileText, User, CheckCircle } from 'lucide-react';

const ModalVenta = ({ 
  isOpen,
  isProcessing, 
  ventaExitosa, 
  onClose, 
  onImprimir,
  clienteDNI,
  productoDestacado = null,
  montoTotal = 0
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {isProcessing ? (
          // Estado de procesamiento
          <div className="text-center">
            {/* Logo del producto o genérico */}
            <div className="mb-6">
              {productoDestacado ? (
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <div className="text-white text-sm font-bold text-center">
                    <div className="text-base">{productoDestacado.nombre?.toUpperCase() || 'PRODUCTO'}</div>
                    <div className="text-xs">{productoDestacado.marca?.toUpperCase() || 'MINIMARKET'}</div>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Contenido de procesamiento */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Procesando Venta</h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
                <span className="text-gray-600">Generando comprobante...</span>
              </div>
            </div>
          </div>
        ) : ventaExitosa ? (
          // Estado de éxito
          <div className="text-center">
            {/* Icono de éxito o logo del producto */}
            <div className="mb-6">
              {productoDestacado ? (
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <div className="text-white text-sm font-bold text-center">
                    <div className="text-base">{productoDestacado.nombre?.toUpperCase() || 'PRODUCTO'}</div>
                    <div className="text-xs">{productoDestacado.marca?.toUpperCase() || 'MINIMARKET'}</div>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Contenido de éxito */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
              <div className="py-3 px-6 rounded-lg mb-4 text-white" style={{ backgroundColor: '#3F7416' }}>
                <h2 className="text-xl font-bold">¡Venta Exitosa!</h2>
                {montoTotal > 0 && (
                  <p className="text-lg font-semibold mt-1">Total: S/ {montoTotal.toFixed(2)}</p>
                )}\n              </div>
              
              
              <div className="flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" style={{ color: '#666666' }} />
                <span className="font-medium" style={{ color: '#333333' }}>Comprobante de Pago Generado</span>
              </div>
            </div>
            
            {/* Botones */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 border rounded-lg font-medium transition-colors duration-200 hover:bg-gray-50"
                style={{ borderColor: '#CCCCCC', color: '#666666' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nueva Venta
              </button>
              <button
                onClick={onImprimir}
                className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#3F7416' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2F5A10'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416'}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Comprobante
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ModalVenta;