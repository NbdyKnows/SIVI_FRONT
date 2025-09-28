import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Calendar, Clock, FileText, ShoppingCart, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PaginacionTabla from '../components/PaginacionTabla';

const CajaChica = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [filtroFechaTemp, setFiltroFechaTemp] = useState('');
  const [filtroFechaHastaTemp, setFiltroFechaHastaTemp] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    totalMonto: 0,
    ventasEfectivo: 0,
    ventasTarjeta: 0,
    ventasYape: 0
  });

  // Cargar ventas del localStorage al montar el componente
  useEffect(() => {
    const ventasGuardadas = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
    // Filtrar solo las ventas del usuario actual
    const ventasUsuario = ventasGuardadas.filter(venta => 
      venta.vendedor === (user?.username || '')
    );
    
    // Ordenar por fecha más reciente primero
    const ventasOrdenadas = ventasUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    setVentas(ventasOrdenadas);
    setVentasFiltradas(ventasOrdenadas);
    
    // Calcular estadísticas
    const stats = {
      totalVentas: ventasOrdenadas.length,
      totalMonto: ventasOrdenadas.reduce((sum, v) => sum + v.total, 0),
      ventasEfectivo: ventasOrdenadas.filter(v => v.metodoPago === 'Efectivo').length,
      ventasTarjeta: ventasOrdenadas.filter(v => v.metodoPago === 'Tarjeta').length,
      ventasYape: ventasOrdenadas.filter(v => v.metodoPago === 'Yape/Plin').length
    };
    setEstadisticas(stats);
  }, [user]);

  // Función para aplicar filtros manualmente
  const aplicarFiltros = () => {
    // Validar que la fecha "Desde" no sea mayor que "Hasta"
    if (filtroFechaTemp && filtroFechaHastaTemp) {
      const fechaDesde = new Date(filtroFechaTemp);
      const fechaHasta = new Date(filtroFechaHastaTemp);
      
      if (fechaDesde > fechaHasta) {
        alert('La fecha "Desde" no puede ser mayor que la fecha "Hasta"');
        return;
      }
    }
    
    let filtradas = [...ventas];
    
    if (filtroFechaTemp) {
      const fechaInicio = new Date(filtroFechaTemp);
      fechaInicio.setHours(0, 0, 0, 0); // Establecer hora a 00:00:00
      filtradas = filtradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta >= fechaInicio;
      });
    }
    
    if (filtroFechaHastaTemp) {
      const fechaFin = new Date(filtroFechaHastaTemp);
      fechaFin.setHours(23, 59, 59, 999); // Establecer hora a 23:59:59
      filtradas = filtradas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta <= fechaFin;
      });
    }
    
    setVentasFiltradas(filtradas);
    setFiltroFecha(filtroFechaTemp);
    setFiltroFechaHasta(filtroFechaHastaTemp);
    setCurrentPage(1); // Reset página al filtrar
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroFechaTemp('');
    setFiltroFechaHastaTemp('');
    setFiltroFecha('');
    setFiltroFechaHasta('');
    setVentasFiltradas([...ventas]);
    setCurrentPage(1);
  };

  // Inicializar ventasFiltradas con todas las ventas
  useEffect(() => {
    setVentasFiltradas([...ventas]);
  }, [ventas]);

  // Obtener items de la página actual
  const totalPages = Math.ceil(ventasFiltradas.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const ventasPagina = ventasFiltradas.slice(startIndex, startIndex + pageSize);

  // Obtener ícono del método de pago
  const getIconoMetodoPago = (metodo) => {
    switch (metodo) {
      case 'Efectivo':
        return <Banknote className="w-4 h-4" />;
      case 'Tarjeta':
        return <CreditCard className="w-4 h-4" />;
      case 'Yape/Plin':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  // Obtener color del método de pago
  const getColorMetodoPago = (metodo) => {
    switch (metodo) {
      case 'Efectivo':
        return '#3F7416';
      case 'Tarjeta':
        return '#633416';
      case 'Yape/Plin':
        return '#666666';
      default:
        return '#CCCCCC';
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>Mis Ventas</h1>
          <p className="mt-1" style={{ color: '#666666' }}>Historial de ventas realizadas por {user?.username || 'Usuario'}</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#CCCCCC' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
              <ShoppingCart className="h-6 w-6" style={{ color: '#3F7416' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#666666' }}>Total Ventas</p>
              <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>{estadisticas.totalVentas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#CCCCCC' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
              <DollarSign className="h-6 w-6" style={{ color: '#633416' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#666666' }}>Monto Total</p>
              <p className="text-2xl font-bold" style={{ color: '#633416' }}>S/ {estadisticas.totalMonto.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#CCCCCC' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
              <Banknote className="h-6 w-6" style={{ color: '#3F7416' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#666666' }}>Ventas Efectivo</p>
              <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>{estadisticas.ventasEfectivo}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#CCCCCC' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
              <CreditCard className="h-6 w-6" style={{ color: '#633416' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: '#666666' }}>Otros Métodos</p>
              <p className="text-2xl font-bold" style={{ color: '#633416' }}>{estadisticas.ventasTarjeta + estadisticas.ventasYape}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border p-4" style={{ borderColor: '#CCCCCC' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" style={{ color: '#3F7416' }} />
            <h3 className="text-base font-semibold" style={{ color: '#633416' }}>Filtrar por Fechas</h3>
          </div>

        </div>
        
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium mb-1" style={{ color: '#666666' }}>
              Desde
            </label>
            <input
              type="date"
              value={filtroFechaTemp}
              onChange={(e) => setFiltroFechaTemp(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1"
              style={{ 
                borderColor: (filtroFechaTemp && filtroFechaHastaTemp && new Date(filtroFechaTemp) > new Date(filtroFechaHastaTemp)) ? '#ff6b6b' : '#CCCCCC', 
                '--tw-ring-color': '#3F7416' 
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  aplicarFiltros();
                }
              }}
            />
            {filtroFechaTemp && filtroFechaHastaTemp && new Date(filtroFechaTemp) > new Date(filtroFechaHastaTemp) && (
              <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>
                La fecha "Desde" no puede ser mayor que "Hasta"
              </p>
            )}
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium mb-1" style={{ color: '#666666' }}>
              Hasta
            </label>
            <input
              type="date"
              value={filtroFechaHastaTemp}
              onChange={(e) => setFiltroFechaHastaTemp(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1"
              style={{ 
                borderColor: (filtroFechaTemp && filtroFechaHastaTemp && new Date(filtroFechaTemp) > new Date(filtroFechaHastaTemp)) ? '#ff6b6b' : '#CCCCCC', 
                '--tw-ring-color': '#3F7416' 
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  aplicarFiltros();
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 text-sm border rounded-lg transition-colors whitespace-nowrap"
              style={{ borderColor: '#CCCCCC', color: '#666666' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Limpiar
            </button>
            <button
              onClick={aplicarFiltros}
              disabled={filtroFechaTemp && filtroFechaHastaTemp && new Date(filtroFechaTemp) > new Date(filtroFechaHastaTemp)}
              className="px-4 py-2 text-sm text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: (filtroFechaTemp && filtroFechaHastaTemp && new Date(filtroFechaTemp) > new Date(filtroFechaHastaTemp)) ? '#CCCCCC' : '#3F7416'
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
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-xl shadow-sm border" style={{ borderColor: '#CCCCCC' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#CCCCCC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#633416' }}>
              <FileText className="w-5 h-5" />
              Historial de Ventas ({ventasFiltradas.length})
            </h2>
            <div className="text-sm" style={{ color: '#666666' }}>
              Página {currentPage} de {totalPages}
            </div>
          </div>
        </div>
        
        {ventasPagina.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9F9F9' }}>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#633416' }}>
                    Venta
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#633416' }}>
                    Fecha y Hora
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#633416' }}>
                    Resumen
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#633416' }}>
                    Subtotal / IGV
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#633416' }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#CCCCCC' }}>
                {ventasPagina.map((venta) => {
                  const resumenProductos = venta.productos.length <= 3 
                    ? venta.productos 
                    : [...venta.productos.slice(0, 2), { nombre: `+${venta.productos.length - 2} productos más`, esResumen: true }];
                  
                  return (
                    <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                      {/* Columna Venta */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-1.5 rounded-full flex-shrink-0"
                            style={{ 
                              backgroundColor: `${getColorMetodoPago(venta.metodoPago)}20`,
                              color: getColorMetodoPago(venta.metodoPago)
                            }}
                          >
                            {getIconoMetodoPago(venta.metodoPago)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: '#000000' }}>
                              #{venta.id.toString().slice(-6)}
                            </p>
                            <p className="text-xs" style={{ color: getColorMetodoPago(venta.metodoPago) }}>
                              {venta.metodoPago}
                            </p>
                            {venta.cliente !== 'Sin registro' && (
                              <p className="text-xs mt-0.5 px-1.5 py-0.5 rounded inline-block" style={{ backgroundColor: '#F9F9F9', color: '#633416' }}>
                                {venta.cliente}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Fecha y Hora */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 flex-shrink-0" style={{ color: '#666666' }} />
                          <div className="text-xs" style={{ color: '#000000' }}>
                            <div>{new Date(venta.fecha).toLocaleDateString('es-PE')}</div>
                            <div style={{ color: '#666666' }}>
                              {new Date(venta.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Resumen de Productos */}
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          {resumenProductos.map((producto, index) => (
                            <div key={index} className={`flex items-center justify-between text-xs p-1 rounded ${
                              producto.esResumen ? 'border border-dashed' : ''
                            }`} style={{ 
                              backgroundColor: producto.esResumen ? 'transparent' : '#F9F9F9',
                              borderColor: producto.esResumen ? '#CCCCCC' : 'transparent'
                            }}>
                              <span className={`truncate ${
                                producto.esResumen ? 'italic font-medium' : 'font-medium'
                              }`} style={{ 
                                color: producto.esResumen ? '#666666' : '#000000',
                                maxWidth: '120px'
                              }}>
                                {producto.nombre}
                              </span>
                              {!producto.esResumen && (
                                <div className="flex items-center gap-1 text-xs flex-shrink-0">
                                  <span style={{ color: '#666666' }}>x{producto.cantidad}</span>
                                  <span className="font-semibold" style={{ color: '#3F7416' }}>
                                    S/ {producto.total.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="text-xs pt-1 border-t" style={{ borderColor: '#CCCCCC', color: '#666666' }}>
                            Total: {venta.productos.length} producto{venta.productos.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      
                      {/* Columna Subtotal/IGV */}
                      <td className="px-3 py-3 text-center">
                        <div className="space-y-0.5 text-xs">
                          <div style={{ color: '#666666' }}>
                            S/ {venta.subtotal.toFixed(2)}
                          </div>
                          <div style={{ color: '#666666' }}>
                            S/ {venta.igv.toFixed(2)}
                          </div>
                          {venta.descuentos > 0 && (
                            <div style={{ color: '#ff6b6b' }}>
                              -S/ {venta.descuentos.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Columna Total */}
                      <td className="px-3 py-3 text-right">
                        <p className="text-lg font-bold" style={{ color: '#3F7416' }}>
                          S/ {venta.total.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="max-w-md mx-auto">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCCCCC' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#666666' }}>No se encontraron ventas</h3>
              <p className="text-sm" style={{ color: '#CCCCCC' }}>
                {ventas.length === 0 
                  ? 'Aún no has realizado ninguna venta. Ve a la sección de Ventas para comenzar.'
                  : 'No hay ventas en el rango de fechas seleccionado. Intenta ajustar los filtros.'
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Paginación */}
        {ventasFiltradas.length > 0 && (
          <PaginacionTabla
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={pageSize}
            totalItems={ventasFiltradas.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CajaChica;