import React, { useState, useEffect } from 'react';
import { ArrowLeft, Percent } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { ModalVenta, ModalCliente } from '../components/modales';
import BusquedaProductos from '../components/BusquedaProductos';
import TablaProductos from '../components/TablaProductos';
import ComprobantePago from '../components/ComprobantePago';
import ventasService from '../services/ventasService';
import inventarioService from '../services/inventarioService';
import descuentosService from '../services/descuentosService';
import clientesService from '../services/clientesService';
import productosService from '../services/productosService';
import { generarTicketPDF } from '../utils/generarTicketPDF';

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
  const [productosConDescuento, setProductosConDescuento] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [aplicaDescuentoFidelidad, setAplicaDescuentoFidelidad] = useState(false);
  const [porcentajeDescuentoFidelidad, setPorcentajeDescuentoFidelidad] = useState(0);
  const [ventaCreadaData, setVentaCreadaData] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // Estados adicionales para descuentos automáticos
  const [mostrarDescuentoFidelidad, setMostrarDescuentoFidelidad] = useState(false);

  // Función para verificar descuento de fidelidad desde el backend
  const verificarDescuentoFidelidad = async (idCliente) => {
    if (!idCliente) {
      setAplicaDescuentoFidelidad(false);
      setPorcentajeDescuentoFidelidad(0);
      return;
    }
    
    try {
      const { aplicaDescuentoFidelidad, porcentaje } = await clientesService.verificarDescuentoFidelidad(idCliente);
      setAplicaDescuentoFidelidad(aplicaDescuentoFidelidad);
      setPorcentajeDescuentoFidelidad(porcentaje || 0);
    } catch (error) {
      console.error('Error al verificar descuento de fidelidad:', error);
      setAplicaDescuentoFidelidad(false);
      setPorcentajeDescuentoFidelidad(0);
    }
  };

  // Función para obtener descuentos activos desde el backend
  const obtenerDescuentosActivos = async () => {
    try {
      const descuentos = await descuentosService.getActivos();
      return descuentos;
    } catch (error) {
      console.warn('⚠️ Error al obtener descuentos del backend, usando localStorage:', error);
      // Fallback a localStorage
      const descuentosGuardados = localStorage.getItem('descuentos_sivi');
      if (!descuentosGuardados) return [];
      
      const descuentos = JSON.parse(descuentosGuardados);
      const hoy = new Date();
      
      return descuentos.filter(descuento => {
        const fechaInicio = new Date(descuento.fecha_inicio);
        const fechaFin = new Date(descuento.fecha_fin);
        return descuento.activo && fechaInicio <= hoy && fechaFin >= hoy;
      });
    }
  };

  // Función para aplicar descuentos a productos
  const aplicarDescuentosAProductos = async (productos) => {
    const descuentosActivos = await obtenerDescuentosActivos();
    
    return productos.map(producto => {
      let descuentoAplicable = null;
      let descuentoValor = 0;
      
      // Buscar descuentos aplicables
      for (const descuento of descuentosActivos) {
        let aplicaDescuento = false;
        
        if (descuento.tipo_aplicacion === 'producto') {
          // Descuento por producto específico
          aplicaDescuento = descuento.productos_seleccionados.some(p => p.id === producto.idProducto);
        } else if (descuento.tipo_aplicacion === 'categoria') {
          // Descuento por categoría
          aplicaDescuento = descuento.categorias_seleccionadas.some(cat => 
            cat.nombre.toLowerCase() === (producto.categoria || '').toLowerCase()
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

  // Cargar productos desde la API
  const cargarProductosDesdeAPI = async () => {
    setIsLoadingProducts(true);
    try {
      // Cargar productos e inventario en paralelo
      const [productos, inventario] = await Promise.all([
        productosService.getAll(),
        inventarioService.getAll()
      ]);
      
      console.log('📦 Productos cargados:', productos);
      console.log('📊 Inventario cargado:', inventario);
      
      // Crear mapa de inventario para búsqueda rápida
      const inventarioMap = {};
      inventario.forEach(inv => {
        if (inv.habilitado) {
          inventarioMap[inv.idProducto] = inv;
        }
      });

      // Transformar estructura de API a estructura esperada
      const productosFormateados = productos
        .filter(p => p.habilitado)
        .map(producto => {
          const inv = inventarioMap[producto.idProducto];
          
          // Si no hay inventario o stock es 0, no incluir el producto
          if (!inv || !inv.stock || inv.stock <= 0) {
            return null;
          }

          return {
            id_producto: producto.idProducto,
            idProducto: producto.idProducto,
            nombre: producto.descripcion,
            descripcion: producto.descripcion,
            stock: inv.stock || 0,
            precio_venta: inv.precio || 0,
            codigo: producto.codigo || `P${String(producto.idProducto).padStart(3, '0')}`,
            categoria: producto.categoria || 'Sin categoría',
            id_cat: producto.idCat,
            habilitado: true
          };
        })
        .filter(p => p !== null);

      console.log('✅ Productos formateados:', productosFormateados);

      // Aplicar descuentos
      const productosConDesc = await aplicarDescuentosAProductos(productosFormateados);
      setProductosDisponibles(productosConDesc);
      setProductosConDescuento(productosConDesc);
    } catch (error) {
      console.error('❌ Error al cargar productos desde API:', error);
      // Fallback a JSON local si falla la API
      console.warn('⚠️ Usando productos del JSON local como fallback');
      cargarProductosDesdeJSON();
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fallback: Cargar productos desde JSON local
  const cargarProductosDesdeJSON = async () => {
    if (!database?.producto) return;
    
    const productos = database.producto.filter(p => p.habilitado).map(producto => {
      const inventario = database?.inventario?.find(inv => inv.id_producto === producto.id_producto && inv.habilitado);
      const categoria = database?.producto_cat?.find(c => c.id_cat === producto.id_cat);
      return {
        id_producto: producto.id_producto,
        idProducto: producto.id_producto,
        stock: inventario?.stock || 0,
        precio_venta: inventario?.precio || 0,
        codigo: `P${String(producto.id_producto).padStart(3, '0')}`,
        nombre: producto.descripcion,
        descripcion: producto.descripcion,
        categoria: categoria?.descripcion || 'Sin categoría',
        habilitado: true
      };
    }).filter(p => p.stock > 0);

    const productosConDesc = await aplicarDescuentosAProductos(productos);
    setProductosDisponibles(productosConDesc);
    setProductosConDescuento(productosConDesc);
  };

  // Buscar productos con autocomplete
  const buscarProductos = async (query) => {
    if (!query || query.trim().length < 1) {
      // Si no hay búsqueda, mostrar todos los productos disponibles
      setProductosConDescuento(productosDisponibles);
      return;
    }

    try {
      // Obtener productos e inventario
      const [resultados, inventario] = await Promise.all([
        productosService.search(query),
        inventarioService.getAll()
      ]);
      
      console.log('🔍 Resultados búsqueda:', resultados);
      
      // Crear mapa de inventario
      const inventarioMap = {};
      inventario.forEach(inv => {
        if (inv.habilitado) {
          inventarioMap[inv.idProducto] = inv;
        }
      });
      
      // Transformar y filtrar resultados
      const productosFormateados = resultados
        .filter(p => p.habilitado)
        .map(producto => {
          const inv = inventarioMap[producto.idProducto];
          
          // Si no hay inventario o stock es 0, no incluir
          if (!inv || !inv.stock || inv.stock <= 0) {
            return null;
          }

          return {
            id_producto: producto.idProducto,
            idProducto: producto.idProducto,
            nombre: producto.descripcion,
            descripcion: producto.descripcion,
            stock: inv.stock || 0,
            precio_venta: inv.precio || 0,
            codigo: producto.codigo || `P${String(producto.idProducto).padStart(3, '0')}`,
            categoria: producto.categoria || 'Sin categoría',
            id_cat: producto.idCat,
            habilitado: true
          };
        })
        .filter(p => p !== null);

      console.log('✅ Productos encontrados:', productosFormateados);

      const productosConDesc = await aplicarDescuentosAProductos(productosFormateados);
      setProductosConDescuento(productosConDesc);
    } catch (error) {
      console.error('❌ Error al buscar productos:', error);
      // Fallback a búsqueda local
      const resultadosLocales = productosDisponibles.filter(p =>
        p.nombre?.toLowerCase().includes(query.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(query.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(query.toLowerCase())
      );
      setProductosConDescuento(resultadosLocales);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductosDesdeAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        buscarProductos(searchTerm);
      } else {
        setProductosConDescuento(productosDisponibles);
      }
    }, 200); // Debounce de 200ms para respuesta más rápida

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Filtrar productos por búsqueda
  const productosFiltrados = productosConDescuento;

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

  // Calcular subtotal sin IGV y descuentos por productos
  const subtotal = productosVenta.reduce((sum, producto) => {
    const precioFinal = producto.precio_con_descuento || producto.precio_venta;
    const precioSinIGV = precioFinal / 1.18; // Precio sin IGV
    return sum + (precioSinIGV * producto.cantidad);
  }, 0);
  
  // Calcular descuento total por productos
  const descuentoProductos = productosVenta.reduce((sum, producto) => {
    if (producto.descuento_valor && producto.precio_venta > (producto.precio_con_descuento || producto.precio_venta)) {
      const descuentoPorUnidad = producto.precio_venta - (producto.precio_con_descuento || producto.precio_venta);
      return sum + (descuentoPorUnidad * producto.cantidad);
    }
    return sum;
  }, 0);
  
  // Calcular descuento de fidelidad sobre el subtotal
  const descuentoFidelidadMonto = aplicaDescuentoFidelidad ? (subtotal * porcentajeDescuentoFidelidad / 100) : 0;
  
  // Calcular IGV sobre el subtotal con descuento de fidelidad aplicado
  const subtotalConDescuentoFidelidad = subtotal - descuentoFidelidadMonto;
  const igv = subtotalConDescuentoFidelidad * 0.18;
  
  // Total final
  const total = subtotalConDescuentoFidelidad + igv;

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

    try {
      // Preparar datos de venta
      const ventaData = {
        idUsuario: user?.id_usuario || user?.idUsuario,
        idCliente: clienteSeleccionado?.idCliente || clienteSeleccionado?.id || null,
        descuentoTotal: descuentoFidelidadMonto + descuentoProductos,
        subtotal: subtotal,
        igv: igv,
        total: total,
        detalles: productosVenta.map(p => {
          return {
            idProducto: p.id_producto,
            idOferta: null,
            descuentoItem: p.descuento_valor || 0,
            precio: p.precio_venta,
            cantidad: p.cantidad
          };
        })
      };

      console.log('📤 Enviando venta al backend:', ventaData);

      // Enviar venta al backend
      const ventaCreada = await ventasService.create(ventaData);
      
      console.log('✅ Venta procesada exitosamente:', ventaCreada);
      
      // Guardar datos de la venta creada para el ticket
      setVentaCreadaData(ventaCreada);
      
      // Actualizar stock localmente para sincronización inmediata
      const inventarioActualizado = { ...database };
      productosVenta.forEach(producto => {
        const inventarioActual = inventarioActualizado?.inventario?.find(
          inv => inv.id_producto === producto.id_producto && inv.habilitado
        );
        if (inventarioActual) {
          const nuevoStock = inventarioActual.stock - producto.cantidad;
          updateInventario(producto.id_producto, inventarioActual.id_movimiento_cab, nuevoStock, inventarioActual.precio);
        }
      });
      
      // Mostrar éxito
      setIsProcessing(false);
      setVentaExitosa(true);
      
    } catch (error) {
      console.error('❌ Error procesando venta:', error);
      
      // Guardar en localStorage como fallback
      console.warn('Guardando venta en localStorage como respaldo...');
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
          porcentaje: porcentajeDescuentoFidelidad,
          monto: descuentoFidelidadMonto
        },
        total: total,
        metodoPago: metodoPago
      };

      const ventasExistentes = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
      ventasExistentes.push(ventaData);
      localStorage.setItem('sivi_ventas', JSON.stringify(ventasExistentes));
      
      // Actualizar stock local
      const inventarioActualizado = { ...database };
      productosVenta.forEach(producto => {
        const inventarioActual = inventarioActualizado?.inventario?.find(
          inv => inv.id_producto === producto.id_producto && inv.habilitado
        );
        if (inventarioActual) {
          const nuevoStock = inventarioActual.stock - producto.cantidad;
          updateInventario(producto.id_producto, inventarioActual.id_movimiento_cab, nuevoStock, inventarioActual.precio);
          inventarioActual.stock = nuevoStock;
        }
      });
      localStorage.setItem('sivi_inventario_temp', JSON.stringify(inventarioActualizado.inventario));
      
      alert('Venta guardada localmente. Sincronizar con el servidor cuando esté disponible.');
      setIsProcessing(false);
      setVentaExitosa(true);
    }
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
    setClienteSeleccionado(null);
    setVentaCreadaData(null);
  };

  // Manejar modal de cliente
  const abrirModalCliente = () => {
    setShowClienteModal(true);
  };

  const cerrarModalCliente = () => {
    setShowClienteModal(false);
  };

  const guardarCliente = async (cliente) => {
    console.log('Cliente seleccionado:', cliente);
    setClienteDNI(cliente.dni || cliente.numeroDocumento);
    setClienteSeleccionado(cliente);
    setShowClienteModal(false);
    
    // Verificar descuento de fidelidad
    if (cliente.idCliente || cliente.id) {
      await verificarDescuentoFidelidad(cliente.idCliente || cliente.id);
    }
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
    if (!ventaCreadaData) {
      console.error('No hay datos de venta para imprimir');
      alert('Error: No se encontraron datos de la venta');
      return;
    }

    try {
      // Crear fecha formateada para el nombre del archivo (usar fecha actual si hay error)
      const ahora = new Date();
      const fechaFormato = ahora.toISOString()
        .replace(/[-:]/g, '')
        .replace('T', '_')
        .split('.')[0]; // YYYYMMDD_HHMMSS

      // Generar el ticket PDF
      generarTicketPDF({
        codigo: ventaCreadaData.codigo,
        fecha: ventaCreadaData.fechaVenta || new Date().toISOString(),
        vendedor: selectedVendedor,
        clienteNombre: clienteSeleccionado?.nombres || clienteSeleccionado?.nombre || 'Sin registro',
        clienteDNI: clienteDNI || 'Sin registro',
        productos: productosVenta.map(p => ({
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio_unitario: p.precio_venta,
          precio_con_descuento: p.precio_con_descuento || p.precio_venta,
          descuento_aplicado: p.descuento ? {
            nombre: p.descuento.nombre,
            tipo: p.descuento.tipo_descuento,
            valor: p.descuento_valor
          } : null
        })),
        subtotal: subtotal,
        igv: igv,
        descuento_productos: descuentoProductos,
        descuento_fidelidad: {
          porcentaje: porcentajeDescuentoFidelidad,
          monto: descuentoFidelidadMonto
        },
        total: total,
        metodoPago: metodoPago,
        fechaFormato: fechaFormato
      });

      console.log('✅ Ticket PDF generado exitosamente');
    } catch (error) {
      console.error('❌ Error al generar ticket PDF:', error);
      alert('Error al generar el ticket. Por favor intente nuevamente.');
    }
    
    cerrarModal();
  };

  // Actualizar descuento de fidelidad cuando cambie el cliente
  useEffect(() => {
    const actualizarDescuento = async () => {
      if (clienteSeleccionado?.idCliente) {
        await verificarDescuentoFidelidad(clienteSeleccionado.idCliente);
        setMostrarDescuentoFidelidad(aplicaDescuentoFidelidad);
      } else {
        setAplicaDescuentoFidelidad(false);
        setPorcentajeDescuentoFidelidad(0);
        setMostrarDescuentoFidelidad(false);
      }
    };
    
    actualizarDescuento();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteSeleccionado]);

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
        clienteDNI={clienteDNI}
        montoTotal={productosVenta.reduce((sum, p) => sum + (p.precio_venta * p.cantidad), 0)}
      />
    </div>
  );
};

export default Ventas;