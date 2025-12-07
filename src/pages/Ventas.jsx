import React, { useState } from 'react';
import { ArrowLeft, Percent } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { useProductos, useCarrito, useVentaProcess } from '../hooks/ventas';
import { ModalVenta, ModalCliente } from '../components/modales';
import BusquedaProductos from '../components/BusquedaProductos';
import TablaProductos from '../components/TablaProductos';
import ComprobantePago from '../components/ComprobantePago';

const Ventas = () => {
  const { data: database, updateInventario } = useDatabase();
  const { user } = useAuth();

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  // Custom hooks para gestión de productos
  const {
    productos,
    productosFiltrados,
    isLoading: isLoadingProducts
  } = useProductos(searchTerm, database);

  // Custom hook para gestión del carrito
  const {
    items: productosVenta,
    productoSeleccionado,
    cantidadSeleccionada,
    setCantidadSeleccionada,
    agregarProducto: agregarProductoAlCarrito,
    quitarProducto,
    editarCantidad: editarCantidadProducto,
    seleccionarProducto,
    limpiarCarrito,
    subtotal,
    descuentoProductos,
    descuentoFidelidad: descuentoFidelidadMonto,
    igv,
    total
  } = useCarrito(false, 0); // Estos valores se actualizarán con el hook de proceso

  // Custom hook para procesamiento de ventas
  const {
    cliente: clienteSeleccionado,
    clienteDNI,
    setClienteDNI,
    aplicaDescuentoFidelidad,
    porcentajeDescuentoFidelidad,
    mostrarDescuentoFidelidad,
    showModal,
    showClienteModal,
    setShowClienteModal,
    isProcessing,
    ventaExitosa,
    selectedVendedor,
    setSelectedVendedor,
    guardarCliente,
    procesarVenta,
    imprimirComprobante,
    cerrarModal
  } = useVentaProcess(
    productosVenta,
    { subtotal, descuentoProductos, descuentoFidelidad: descuentoFidelidadMonto, igv, total },
    user,
    updateInventario,
    database,
    limpiarCarrito,
    metodoPago
  );

  // Wrapper para agregar producto que también limpia el término de búsqueda
  const agregarProducto = () => {
    agregarProductoAlCarrito();
    setSearchTerm('');
  };

  // Función para limpiar datos de prueba (desarrollo)
  const limpiarDatosPrueba = () => {
    if (window.confirm('¿Desea limpiar todas las ventas y restaurar el stock original?')) {
      localStorage.removeItem('sivi_ventas');
      localStorage.removeItem('sivi_inventario_temp');
      console.log('%c🧹 Datos de prueba limpiados - Stock restaurado', 'color: #ff6b6b; font-weight: bold;');
      window.location.reload();
    }
  };

  // Abrir modal de cliente
  const abrirModalCliente = () => {
    setShowClienteModal(true);
  };

  // Cerrar modal de cliente
  const cerrarModalCliente = () => {
    setShowClienteModal(false);
  };

  // Loading state
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#3F7416' }}>
              Nueva Venta
            </h1>
            <div className="flex items-center space-x-2">
              {/* Botón de desarrollo */}
              <button
                onClick={limpiarDatosPrueba}
                className="px-2 sm:px-3 py-1 text-xs border rounded transition-colors"
                style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b6b';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#ff6b6b';
                }}
              >
                🧹 Limpiar
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Atrás</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notificación de Descuento de Fidelidad */}
        {mostrarDescuentoFidelidad && (
          <div className="mb-4 p-3 sm:p-4 rounded-lg border-l-4 animate-fade-in" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <Percent className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#F59E0B' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: '#92400E' }}>
                  ¡Cliente Fidelizado!
                </h3>
                <p className="text-xs mt-1" style={{ color: '#78350F' }}>
                  El cliente tiene compras suficientes en el último mes.
                  <strong> Descuento automático del {porcentajeDescuentoFidelidad}% aplicado.</strong>
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-base sm:text-lg font-bold" style={{ color: '#F59E0B' }}>
                  -{porcentajeDescuentoFidelidad}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal responsive */}
        <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4">
          {/* Panel izquierdo - Búsqueda y productos */}
          <div className="xl:col-span-2 space-y-4 w-full">
            {/* Búsqueda de productos */}
            <div className="w-full">
              <BusquedaProductos
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedVendedor={selectedVendedor}
                productosFiltrados={productosFiltrados}
                seleccionarProducto={seleccionarProducto}
                productoSeleccionado={productoSeleccionado}
                cantidadSeleccionada={cantidadSeleccionada}
                setCantidadSeleccionada={setCantidadSeleccionada}
                agregarProducto={agregarProducto}
                total={total}
                descuentoFidelidad={porcentajeDescuentoFidelidad}
                clienteDNI={clienteDNI}
              />
            </div>

            {/* Tabla de productos en la venta */}
            <div className={productosVenta.length > 0 ? "max-h-64 sm:max-h-80 xl:max-h-96 overflow-auto" : "w-full"}>
              <TablaProductos
                productosVenta={productosVenta}
                quitarProducto={quitarProducto}
                editarCantidadProducto={editarCantidadProducto}
              />
            </div>
          </div>

          {/* Panel derecho - Comprobante de pago */}
          <div className="w-full xl:self-start">
            <ComprobantePago
              productosVenta={productosVenta}
              subtotal={subtotal}
              igv={igv}
              descuentos={descuentoProductos}
              descuentoFidelidad={{
                porcentaje: porcentajeDescuentoFidelidad,
                monto: descuentoFidelidadMonto
              }}
              total={total}
              metodoPago={metodoPago}
              setMetodoPago={setMetodoPago}
              clienteDNI={clienteDNI}
              clienteSeleccionado={clienteSeleccionado}
              abrirModalCliente={abrirModalCliente}
              procesarVenta={procesarVenta}
            />
          </div>
        </div>
      </div>

      {/* Modal de Cliente */}
      <ModalCliente
        isOpen={showClienteModal}
        onClose={cerrarModalCliente}
        onSave={guardarCliente}
        clienteActual={clienteDNI}
      />

      {/* Modal de Venta */}
      <ModalVenta
        isOpen={showModal}
        isProcessing={isProcessing}
        ventaExitosa={ventaExitosa}
        onClose={cerrarModal}
        onImprimir={imprimirComprobante}
      />
    </div>
  );
};

export default Ventas;