import React from 'react';
import { ShoppingCart, X } from 'lucide-react';

const TablaProductos = ({
  productosVenta,
  quitarProducto,
  editarCantidadProducto
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${productosVenta.length > 0 ? 'flex flex-col' : ''}`}>
      <div className="p-3 border-b" style={{ borderColor: '#CCCCCC' }}>
        <h2 className="text-base font-semibold" style={{ color: '#633416' }}>Productos</h2>
      </div>
      
      {productosVenta.length > 0 ? (
        <div className="max-h-60 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio U.</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Impuesto</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosVenta.map(producto => (
                <tr key={producto.id_producto}>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded flex items-center justify-center shadow-sm">
                        <div className="text-white text-[10px] font-bold text-center">
                          <div>MILO</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={producto.stock}
                            value={producto.cantidad}
                            onChange={(e) => {
                              const nuevaCantidad = Math.max(1, parseInt(e.target.value) || 1);
                              if (nuevaCantidad <= producto.stock) {
                                editarCantidadProducto(producto.id_producto, nuevaCantidad);
                              }
                            }}
                            className="w-12 px-1 py-1 text-xs text-center border rounded focus:outline-none focus:ring-1 bg-white"
                            style={{ borderColor: '#CCCCCC', '--tw-ring-color': '#3F7416' }}
                          />
                          <span className="text-xs text-gray-600">Uni</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-32 mt-1">{producto.nombre}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {producto.descuento ? (
                      <div>
                        <div className="text-xs line-through text-gray-400">
                          S/ {producto.precio_venta.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          S/ {producto.precio_con_descuento.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        S/ {producto.precio_venta.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {producto.descuento ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-1 py-0.5 rounded text-white" style={{ backgroundColor: '#F59E0B' }}>
                          -{producto.descuento.tipo_descuento === 'porcentaje' ? `${producto.descuento_valor}%` : `S/${producto.descuento_valor}`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin descuento</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-900 text-sm">
                    S/ {(((producto.precio_con_descuento || producto.precio_venta) / 1.18) * 0.18).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => quitarProducto(producto.id_producto)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center">
          <ShoppingCart className="w-8 h-8 mx-auto mb-2" style={{ color: '#CCCCCC' }} />
          <p className="text-sm" style={{ color: '#666666' }}>No hay productos agregados</p>
          <p className="text-xs" style={{ color: '#CCCCCC' }}>Busque y agregue productos para continuar</p>
        </div>
      )}


    </div>
  );
};

export default TablaProductos;