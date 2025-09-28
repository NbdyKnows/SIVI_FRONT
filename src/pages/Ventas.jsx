import React, { useState, useEffect } from 'react';
import { ArrowLeft, Percent } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { ModalVenta, ModalCliente } from '../components/modales';
import BusquedaProductos from '../components/BusquedaProductos';
import TablaProductos from '../components/TablaProductos';
import ComprobantePago from '../components/ComprobantePago';

const Ventas = () => {
  const { data: database, updateInventario } = useDatabase();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendedor, setSelectedVendedor] = useState('');
  const [productosVenta, setProductosVenta] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [clienteDNI, setClienteDNI] = useState('');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [descuentos, setDescuentos] = useState(0); // Mantener para compatibilidad
  const [descuentoFidelidad, setDescuentoFidelidad] = useState(0);
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  
  // Estados adicionales para descuentos automáticos
  const [mostrarDescuentoFidelidad, setMostrarDescuentoFidelidad] = useState(false);

  // Función para obtener descuentos activos desde localStorage
  const obtenerDescuentosActivos = () => {
    const descuentosGuardados = localStorage.getItem('descuentos_sivi');
    if (!descuentosGuardados) return [];
    
    const descuentos = JSON.parse(descuentosGuardados);
    const hoy = new Date();
    
    return descuentos.filter(descuento => {
      const fechaInicio = new Date(descuento.fecha_inicio);
      const fechaFin = new Date(descuento.fecha_fin);
      return descuento.activo && fechaInicio <= hoy && fechaFin >= hoy;
    });
  };

  // Función para calcular descuento de fidelidad (10 compras en un mes = 10%)
  const calcularDescuentoFidelidad = (dni) => {
    if (!dni) return 0;
    
    const ventas = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    
    const comprasRecientes = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha);
      return venta.cliente === dni && fechaVenta >= hace30Dias;
    });
    
    // Si tiene 10 o más compras en el último mes, aplicar 10% de descuento
    return comprasRecientes.length >= 10 ? 10 : 0;
  };

  // Función para aplicar descuentos a productos
  const aplicarDescuentosAProductos = (productos) => {
    const descuentosActivos = obtenerDescuentosActivos();
    
    return productos.map(producto => {
      let descuentoAplicable = null;
      let descuentoValor = 0;
      
      // Buscar descuentos aplicables
      for (const descuento of descuentosActivos) {
        let aplicaDescuento = false;
        
        if (descuento.tipo_aplicacion === 'producto') {
          // Descuento por producto específico
          aplicaDescuento = descuento.productos_seleccionados.some(p => p.id === producto.id_producto);
        } else if (descuento.tipo_aplicacion === 'categoria') {
          // Descuento por categoría
          const categoriaProducto = database?.producto_cat?.find(c => c.id_cat === producto.id_cat);
          aplicaDescuento = descuento.categorias_seleccionadas.some(cat => 
            cat.nombre.toLowerCase() === (categoriaProducto?.descripcion || '').toLowerCase()
          );
        }
        
        if (aplicaDescuento) {
          if (descuento.tipo_descuento === 'porcentaje') {
            descuentoValor = Math.max(descuentoValor, parseFloat(descuento.valor));
          } else {
            descuentoValor = Math.max(descuentoValor, parseFloat(descuento.valor));
          }
          descuentoAplicable = descuento;
        }
      }
      
      return {
        ...producto,
        descuento: descuentoAplicable,
        descuento_valor: descuentoValor,
        precio_con_descuento: descuentoAplicable ? 
          (descuentoAplicable.tipo_descuento === 'porcentaje' ? 
            producto.precio_venta * (1 - descuentoValor / 100) :
            Math.max(0, producto.precio_venta - descuentoValor)
          ) : producto.precio_venta
      };
    });
  };

  // Obtener productos disponibles con inventario y descuentos
  const productos = database?.producto?.filter(p => p.habilitado).map(producto => {
    const inventario = database?.inventario?.find(inv => inv.id_producto === producto.id_producto && inv.habilitado);
    const categoria = database?.producto_cat?.find(c => c.id_cat === producto.id_cat);
    return {
      ...producto,
      stock: inventario?.stock || 0,
      precio_venta: inventario?.precio || 0,
      codigo: `P${String(producto.id_producto).padStart(3, '0')}`,
      nombre: producto.descripcion,
      categoria: categoria?.descripcion || 'Sin categoría'
    };
  }).filter(p => p.stock > 0) || [];

  // Aplicar descuentos a productos disponibles
  const productosConDescuentos = aplicarDescuentosAProductos(productos);

  // Filtrar productos por búsqueda
  const productosFiltrados = productosConDescuentos.filter(producto => {
    return (
      producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Seleccionar producto para agregar
  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidadSeleccionada(1);
  };

  // Agregar producto con cantidad específica
  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    
    const stockDisponible = productoSeleccionado.stock;
    const productoExistente = productosVenta.find(p => p.id_producto === productoSeleccionado.id_producto);
    const cantidadExistente = productoExistente ? productoExistente.cantidad : 0;
    
    if (cantidadExistente + cantidadSeleccionada > stockDisponible) {
      alert(`Stock insuficiente. Disponible: ${stockDisponible - cantidadExistente}`);
      return;
    }

    if (productoExistente) {
      setProductosVenta(prev => 
        prev.map(p => 
          p.id_producto === productoSeleccionado.id_producto 
            ? { ...p, cantidad: p.cantidad + cantidadSeleccionada }
            : p
        )
      );
    } else {
      setProductosVenta(prev => [...prev, {
        ...productoSeleccionado,
        cantidad: cantidadSeleccionada
      }]);
    }
    
    // Limpiar selección
    setProductoSeleccionado(null);
    setCantidadSeleccionada(1);
    setSearchTerm('');
  };

  // Quitar producto de la venta
  const quitarProducto = (idProducto) => {
    setProductosVenta(prev => prev.filter(p => p.id_producto !== idProducto));
  };

  // Editar cantidad de producto en la venta
  const editarCantidadProducto = (idProducto, nuevaCantidad) => {
    setProductosVenta(prev => 
      prev.map(p => 
        p.id_producto === idProducto 
          ? { ...p, cantidad: nuevaCantidad }
          : p
      )
    );
  };

  // Calcular totales con descuentos incluidos
  const totalConIGV = productosVenta.reduce((sum, producto) => {
    const precioFinal = producto.precio_con_descuento || producto.precio_venta;
    return sum + (precioFinal * producto.cantidad);
  }, 0);
  const subtotal = productosVenta.reduce((sum, producto) => {
    const precioFinal = producto.precio_con_descuento || producto.precio_venta;
    const precioSinIGV = precioFinal / 1.18; // Precio sin IGV
    return sum + (precioSinIGV * producto.cantidad);
  }, 0);
  const igv = totalConIGV - subtotal; // IGV es la diferencia
  
  // Calcular descuento total por productos
  const descuentoProductos = productosVenta.reduce((sum, producto) => {
    if (producto.descuento_valor && producto.precio_venta > (producto.precio_con_descuento || producto.precio_venta)) {
      const descuentoPorUnidad = producto.precio_venta - (producto.precio_con_descuento || producto.precio_venta);
      return sum + (descuentoPorUnidad * producto.cantidad);
    }
    return sum;
  }, 0);
  
  // Calcular descuento de fidelidad sobre el total
  const porcentajeFidelidad = calcularDescuentoFidelidad(clienteDNI);
  const descuentoFidelidadMonto = (totalConIGV * porcentajeFidelidad) / 100;
  
  // Total final
  const total = totalConIGV - descuentoFidelidadMonto;

  // Procesar venta y generar comprobante
  const procesarVenta = async () => {
    if (productosVenta.length === 0) {
      alert('Agregue productos a la venta');
      return;
    }

    if (!selectedVendedor) {
      alert('Seleccione un vendedor');
      return;
    }

    // Mostrar modal de procesamiento
    setShowModal(true);
    setIsProcessing(true);
    setVentaExitosa(false);

    // Simular procesamiento de venta
    setTimeout(() => {
      try {
        // Crear registro de venta para localStorage
        const ventaData = {
          id: Date.now(),
          fecha: new Date().toISOString(),
          vendedor: selectedVendedor,
          cliente: clienteDNI || 'Sin registro',
          productos: productosVenta.map(p => {
            const precioFinal = p.precio_con_descuento || p.precio_venta;
            return {
              id_producto: p.id_producto,
              nombre: p.nombre,
              cantidad: p.cantidad,
              precio_unitario: p.precio_venta,
              precio_con_descuento: precioFinal,
              descuento_aplicado: p.descuento ? {
                nombre: p.descuento.nombre,
                tipo: p.descuento.tipo_descuento,
                valor: p.descuento_valor
              } : null,
              subtotal: (precioFinal / 1.18) * p.cantidad,
              igv: ((precioFinal / 1.18) * 0.18) * p.cantidad,
              total: precioFinal * p.cantidad
            };
          }),
          subtotal: subtotal,
          igv: igv,
          descuento_productos: descuentoProductos,
          descuento_fidelidad: {
            porcentaje: porcentajeFidelidad,
            monto: descuentoFidelidadMonto
          },
          total: total,
          metodoPago: metodoPago
        };

        // Guardar venta en localStorage
        const ventasExistentes = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
        ventasExistentes.push(ventaData);
        localStorage.setItem('sivi_ventas', JSON.stringify(ventasExistentes));

        // Actualizar stock en database y localStorage
        const inventarioActualizado = { ...database };
        productosVenta.forEach(producto => {
          const inventarioActual = inventarioActualizado?.inventario?.find(inv => inv.id_producto === producto.id_producto && inv.habilitado);
          if (inventarioActual) {
            const nuevoStock = inventarioActual.stock - producto.cantidad;
            // Actualizar en database (contexto)
            updateInventario(producto.id_producto, inventarioActual.id_movimiento_cab, nuevoStock, inventarioActual.precio);
            // Actualizar en copia local para localStorage
            inventarioActual.stock = nuevoStock;
          }
        });

        // Guardar inventario actualizado en localStorage
        localStorage.setItem('sivi_inventario_temp', JSON.stringify(inventarioActualizado.inventario));
        
        console.log('Venta procesada:', ventaData);
        console.log('Stock actualizado en localStorage');
        
        // Mostrar éxito
        setIsProcessing(false);
        setVentaExitosa(true);
      } catch (error) {
        console.error('Error procesando venta:', error);
        alert('Error al procesar la venta');
        setShowModal(false);
        setIsProcessing(false);
      }
    }, 2000);
  };

  // Cerrar modal y limpiar formulario
  const cerrarModal = () => {
    setShowModal(false);
    setIsProcessing(false);
    setVentaExitosa(false);
    
    // Limpiar formulario
    setProductosVenta([]);
    setSearchTerm('');
    setClienteDNI('');
  };

  // Manejar modal de cliente
  const abrirModalCliente = () => {
    setShowClienteModal(true);
  };

  const cerrarModalCliente = () => {
    setShowClienteModal(false);
  };

  const guardarCliente = (dni) => {
    setClienteDNI(dni);
    setShowClienteModal(false);
  };

  // Función para limpiar datos de prueba (desarrollo)
  const limpiarDatosPrueba = () => {
    if (window.confirm('¿Desea limpiar todas las ventas y restaurar el stock original?')) {
      localStorage.removeItem('sivi_ventas');
      localStorage.removeItem('sivi_inventario_temp');
      console.log('%c🧹 Datos de prueba limpiados - Stock restaurado', 'color: #ff6b6b; font-weight: bold;');
      // Recargar la página para refrescar el inventario
      window.location.reload();
    }
  };

  // Imprimir comprobante
  const imprimirComprobante = () => {
    // Obtener la última venta registrada
    const ventas = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
    const ultimaVenta = ventas[ventas.length - 1];
    
    if (ultimaVenta) {
      console.log('=== COMPROBANTE DE VENTA ===');
      console.log(`Fecha: ${new Date(ultimaVenta.fecha).toLocaleString('es-PE')}`);
      console.log(`Vendedor: ${ultimaVenta.vendedor}`);
      console.log(`Cliente: ${ultimaVenta.cliente}`);
      console.log('\n--- PRODUCTOS ---');
      ultimaVenta.productos.forEach(p => {
        console.log(`${p.nombre} x${p.cantidad} - S/ ${p.precio_unitario.toFixed(2)} = S/ ${p.total.toFixed(2)}`);
      });
      console.log('\n--- TOTALES ---');
      console.log(`Subtotal: S/ ${ultimaVenta.subtotal.toFixed(2)}`);
      console.log(`IGV (18%): S/ ${ultimaVenta.igv.toFixed(2)}`);
      if (ultimaVenta.descuentos > 0) {
        console.log(`Descuentos: -S/ ${ultimaVenta.descuentos.toFixed(2)}`);
      }
      console.log(`TOTAL: S/ ${ultimaVenta.total.toFixed(2)}`);
      console.log(`Método de Pago: ${ultimaVenta.metodoPago}`);
      console.log('========================');
      
      // Mostrar resumen de stock actualizado
      const inventarioTemp = JSON.parse(localStorage.getItem('sivi_inventario_temp') || '[]');
      if (inventarioTemp.length > 0) {
        console.log('\n--- STOCK ACTUALIZADO ---');
        ultimaVenta.productos.forEach(p => {
          const inv = inventarioTemp.find(i => i.id_producto === p.id_producto);
          if (inv) {
            console.log(`${p.nombre}: Stock restante = ${inv.stock}`);
          }
        });
        console.log('========================');
      }
    }
    
    cerrarModal();
  };

  // Actualizar descuento de fidelidad cuando cambie el cliente
  useEffect(() => {
    const porcentaje = calcularDescuentoFidelidad(clienteDNI);
    setDescuentoFidelidad(porcentaje);
    setMostrarDescuentoFidelidad(porcentaje > 0);
  }, [clienteDNI]);

  // Inicializar vendedor actual automáticamente
  useEffect(() => {
    if (user) {
      setSelectedVendedor(user.username || '');
    }
  }, [user]);

  // Cargar y mostrar estadísticas de ventas al iniciar
  useEffect(() => {
    const ventas = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
    const inventarioTemp = JSON.parse(localStorage.getItem('sivi_inventario_temp') || '[]');
    
    if (ventas.length > 0) {
      console.log(`%c📊 SISTEMA SIVI - ${ventas.length} venta(s) registrada(s)`, 'color: #3F7416; font-weight: bold; font-size: 14px;');
      
      // Mostrar resumen de ventas del día
      const ventasHoy = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha).toDateString();
        const hoy = new Date().toDateString();
        return fechaVenta === hoy;
      });
      
      if (ventasHoy.length > 0) {
        const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
        console.log(`%c💰 Ventas de hoy: ${ventasHoy.length} - Total: S/ ${totalVentasHoy.toFixed(2)}`, 'color: #633416; font-weight: bold;');
      }
    }
    
    if (inventarioTemp.length > 0) {
      console.log(`%c📦 Stock actualizado por ventas - ${inventarioTemp.length} productos afectados`, 'color: #666666;');
    }
  }, []);



  // Loading state
  if (!database) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: '#3F7416' }}>
              Nueva Venta
            </h1>
            <div className="flex items-center space-x-2">
              {/* Botón de desarrollo */}
              <button
                onClick={limpiarDatosPrueba}
                className="px-3 py-1 text-xs border rounded transition-colors"
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
                🧹 Limpiar Datos
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Atrás
              </button>
            </div>
          </div>
        </div>

        {/* Notificación de Descuento de Fidelidad */}
        {mostrarDescuentoFidelidad && (
          <div className="mb-4 p-4 rounded-lg border-l-4 animate-fade-in" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Percent className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: '#92400E' }}>
                  ¡Cliente Fidelizado!
                </h3>
                <p className="text-xs mt-1" style={{ color: '#78350F' }}>
                  El cliente {clienteDNI} tiene {calcularDescuentoFidelidad(clienteDNI) === 10 ? '10 o más' : ''} compras en el último mes.
                  <strong> Descuento automático del {descuentoFidelidad}% aplicado.</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: '#F59E0B' }}>
                  -{descuentoFidelidad}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal con altura natural */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Panel izquierdo - Búsqueda y productos */}
          <div className="lg:col-span-2 space-y-4">
            {/* Búsqueda de productos */}
            <div className="flex-shrink-0">
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
                descuentoFidelidad={porcentajeFidelidad}
                clienteDNI={clienteDNI}
              />
            </div>

            {/* Tabla de productos en la venta */}
            <div className={productosVenta.length > 0 ? "max-h-96 overflow-hidden" : ""}>
              <TablaProductos
                productosVenta={productosVenta}
                quitarProducto={quitarProducto}
                editarCantidadProducto={editarCantidadProducto}
              />
            </div>


          </div>

          {/* Panel derecho - Comprobante de pago */}
          <div className="self-start">
            <ComprobantePago
              productosVenta={productosVenta}
              subtotal={subtotal}
              igv={igv}
              descuentos={descuentoProductos}
              descuentoFidelidad={{
                porcentaje: porcentajeFidelidad,
                monto: descuentoFidelidadMonto
              }}
              total={total}
              metodoPago={metodoPago}
              setMetodoPago={setMetodoPago}
              clienteDNI={clienteDNI}
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
        clienteDNI={clienteDNI}
        montoTotal={productosVenta.reduce((sum, p) => sum + (p.precio_venta * p.cantidad), 0)}
      />
    </div>
  );
};

export default Ventas;