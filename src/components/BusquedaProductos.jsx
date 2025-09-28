import React from 'react';
import { Search, X, Plus, User } from 'lucide-react';

const BusquedaProductos = ({
  searchTerm,
  setSearchTerm,
  selectedVendedor,
  productosFiltrados,
  seleccionarProducto,
  productoSeleccionado,
  cantidadSeleccionada,
  setCantidadSeleccionada,
  agregarProducto,
  total,
  descuentoFidelidad,
  clienteDNI
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header con información del vendedor */}
      <div className="px-4 py-2 border-b border-gray-200" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" style={{ color: '#633416' }} />
          <span className="text-sm font-medium" style={{ color: '#633416' }}>Vendedor: {selectedVendedor}</span>
        </div>
      </div>
      
      {/* Área de búsqueda principal */}
      <div className="p-4">
        {/* Búsqueda con controles - Aplicando Ley de Fitts con targets más grandes */}
        <div className="flex space-x-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Buscar por código, nombre o categoría..."
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
          {/* Controles de cantidad - Aplicando Ley de Fitts con botones más grandes */}
          {productoSeleccionado ? (
            <>
              <div className="flex items-center border rounded-lg px-3 py-2" style={{ backgroundColor: '#F9F9F9', borderColor: '#CCCCCC' }}>
                <label className="text-sm font-medium mr-2" style={{ color: '#633416' }}>Cant:</label>
                <input
                  type="number"
                  min="1"
                  max={productoSeleccionado.stock}
                  value={cantidadSeleccionada}
                  onChange={(e) => setCantidadSeleccionada(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-1 border-0 bg-white rounded focus:outline-none text-center font-medium"
                  style={{ '--tw-ring-color': '#3F7416' }}
                />
              </div>
              <button
                onClick={() => {
                  agregarProducto();
                  setSearchTerm('');
                }}
                className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#3F7416DB' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2F5A10'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416DB'}
              >
                ✓ Agregar
              </button>
            </>
          ) : (
            <div className="border px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F5F5', borderColor: '#CCCCCC' }}>
              <span className="text-sm font-semibold" style={{ color: '#633416' }}>Total: S/ {total.toFixed(2)}</span>
            </div>
          )}
      </div>

        {/* Información del producto seleccionado - Mejor jerarquía visual */}
        {productoSeleccionado && (
          <div className="mb-4 p-4 rounded-r-lg shadow-sm" style={{ backgroundColor: '#F9F9F9', borderLeft: '4px solid #3F7416' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1" style={{ color: '#000000' }}>{productoSeleccionado.nombre}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center" style={{ color: '#3F7416' }}>
                    <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#3F7416' }}></span>
                    Stock: {productoSeleccionado.stock}
                  </span>
                  <span style={{ color: '#666666' }}>Código: {productoSeleccionado.codigo}</span>
                </div>
              </div>
              <div className="text-right">
                {productoSeleccionado.descuento ? (
                  <div>
                    <p className="text-lg line-through text-gray-400">S/ {productoSeleccionado.precio_venta.toFixed(2)}</p>
                    <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>S/ {productoSeleccionado.precio_con_descuento.toFixed(2)}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: '#F59E0B' }}>
                        {productoSeleccionado.descuento.nombre} -{productoSeleccionado.descuento.tipo_descuento === 'porcentaje' ? `${productoSeleccionado.descuento_valor}%` : `S/${productoSeleccionado.descuento_valor}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>S/ {productoSeleccionado.precio_venta.toFixed(2)}</p>
                    <p className="text-xs" style={{ color: '#666666' }}>por unidad</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resultados de búsqueda - Aplicando Ley de Miller (máximo 5 items) */}
        {searchTerm && productosFiltrados.length > 0 && (
          <div className="mt-4 rounded-lg overflow-hidden shadow-inner" style={{ backgroundColor: '#F5F5F5' }}>
            <div className="px-3 py-2 border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#CCCCCC' }}>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#666666' }}>
                Resultados ({productosFiltrados.length > 5 ? '5+' : productosFiltrados.length})
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {productosFiltrados.slice(0, 5).map((producto, index) => {
                const isSelected = productoSeleccionado?.id_producto === producto.id_producto;
                return (
                  <div
                    key={producto.id_producto}
                    onClick={() => {
                      seleccionarProducto(producto);
                      setSearchTerm(producto.nombre);
                    }}
                    className={`group flex items-center justify-between p-3 cursor-pointer transition-all duration-150 border-l-4 ${
                      index !== productosFiltrados.slice(0, 5).length - 1 ? 'border-b' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? '#F9F9F9' : 'transparent',
                      borderLeftColor: isSelected ? '#3F7416' : 'transparent',
                      borderBottomColor: '#CCCCCC'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: isSelected ? '#633416' : '#000000' }}>
                        {producto.nombre}
                      </p>
                      <div className="flex items-center space-x-3 mt-1 text-xs" style={{ color: '#666666' }}>
                        <span className="px-2 py-0.5 rounded font-mono" style={{ backgroundColor: '#F5F5F5', color: '#666666' }}>{producto.codigo}</span>
                        <span>{producto.categoria}</span>
                        <span className="font-medium" style={{
                          color: producto.stock > 10 ? '#3F7416' : producto.stock > 5 ? '#633416' : '#666666'
                        }}>
                          Stock: {producto.stock}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {producto.descuento ? (
                        <div>
                          <p className="text-xs line-through text-gray-400">
                            S/ {producto.precio_venta.toFixed(2)}
                          </p>
                          <p className="font-bold text-base" style={{ color: isSelected ? '#3F7416' : '#000000' }}>
                            S/ {producto.precio_con_descuento.toFixed(2)}
                          </p>
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs px-1 py-0.5 rounded text-white" style={{ backgroundColor: '#F59E0B' }}>
                              -{producto.descuento.tipo_descuento === 'porcentaje' ? `${producto.descuento_valor}%` : `S/${producto.descuento_valor}`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-base" style={{ color: isSelected ? '#3F7416' : '#000000' }}>
                            S/ {producto.precio_venta.toFixed(2)}
                          </p>
                          <p className="text-xs" style={{ color: '#666666' }}>por unidad</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {searchTerm && productosFiltrados.length === 0 && (
          <div className="mt-4 text-center py-8 rounded-lg border-2 border-dashed" style={{ backgroundColor: '#F5F5F5', borderColor: '#CCCCCC' }}>
            <div className="mb-2" style={{ color: '#CCCCCC' }}>
              <Search className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm font-medium" style={{ color: '#666666' }}>No se encontraron productos</p>
            <p className="text-xs mt-1" style={{ color: '#CCCCCC' }}>Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusquedaProductos;