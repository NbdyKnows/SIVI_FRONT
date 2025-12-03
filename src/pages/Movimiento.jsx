import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Save, X, ShoppingCart, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import database from '../data/database.json';
import PaginacionTabla from '../components/PaginacionTabla';
import movimientosService from '../services/movimientosService';
import productosService from '../services/productosService'; // O como se llame tu archivo

const MovimientosInventario = () => {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estados para el formulario de cabecera
  const [cabecera, setCabecera] = useState({
    entradaSalida: 1, // 1: Entrada, 2: Salida
    fecha: new Date().toISOString().slice(0, 16)
  });

  // Estados para el detalle
  const [detalles, setDetalles] = useState([]);
  const [detalleActual, setDetalleActual] = useState({
    idProducto: '',
    cantidad: '',
    precioCompra: '',
    precioVenta: ''
  });

  // Estados de validación
  const [errores, setErrores] = useState({
    producto: '',
    cantidad: '',
    precioCompra: '',
    precioVenta: ''
  });

  // Estados para UI
  const [mostrarModal, setMostrarModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtroTipo, setFiltroTipo] = useState('');

  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
  const [detallesModal, setDetallesModal] = useState(false);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);

  // Usuario actual de sesión (simulado)
  const [usuarioActual] = useState({
    id_usuario: 1,
    nombre: 'Usuario Actual',
    usuario: 'admin'
  });

const cargarDatos = async () => {
      try {
        // 1. Cargar movimientos desde el backend
        const dataMovimientos = await movimientosService.getAll(0); // 0 para Entradas
        console.log('Movimientos cargados desde API:', dataMovimientos);

        // Mapear los datos del backend a la estructura que espera tu componente
        const movimientosMapeados = dataMovimientos.map(mov => ({
          id_movimiento_cab: mov.idMovimientoCab,
          codigo: mov.codigo,
          usuario: mov.usuario,
          entrada_salida: mov.tipoMovimiento === 'ENTRADA' ? 1 : 2,
          fecha: new Date().toISOString(), // Ajusta según lo que devuelva el backend
          //detalles: [], // El backend solo devuelve cabecera, no detalles
          cantidadProductos: mov.cantidadProductos,
          habilitado: true
        }));

        setMovimientos(movimientosMapeados);
        setMovimientosFiltrados(movimientosMapeados);

        // 2. Cargar productos DESDE EL BACKEND
        console.log('🔄 Cargando productos del backend...');
        const productosBackend = await productosService.getAll();
        console.log('✅ Productos cargados:', productosBackend.length);

        // Mapear productos del backend a la estructura que espera tu componente
        const productosMapeados = productosBackend.map(producto => ({
          id_producto: producto.idProducto || producto.id,
          codigo: producto.codigo || '',
          descripcion: producto.descripcion || producto.nombre || '',
          // Agrega otros campos que necesites
          precio_compra: producto.precioCompra || 0,
          precio_venta: producto.precioVenta || 0,
          stock: producto.stock || 0,
          habilitado: producto.habilitado !== false
        })).sort((a, b) => a.descripcion.localeCompare(b.descripcion)); // <-- ORDENAR AQUÍ

        setProductos(productosMapeados);

      } catch (error) {
        console.error('Error al cargar datos:', error);
        // Si hay error, carga datos locales como respaldo
        const movimientosData = database.movimiento_cab || [];
        setMovimientos(movimientosData);
        setMovimientosFiltrados(movimientosData);
        setProductos(database.producto || []);
      }
    };

  useEffect(() => {
    

    cargarDatos();
  }, []);

  // Validar formulario de detalle
  const validarDetalle = () => {
    const nuevosErrores = {
      producto: '',
      cantidad: '',
      precioCompra: '',
      precioVenta: ''
    };

    let valido = true;

    // Validar producto
    if (!detalleActual.idProducto) {
      nuevosErrores.producto = 'Debe seleccionar un producto';
      valido = false;
    }

    // Validar cantidad
    if (!detalleActual.cantidad) {
      nuevosErrores.cantidad = 'La cantidad es obligatoria';
      valido = false;
    } else if (isNaN(detalleActual.cantidad) || parseFloat(detalleActual.cantidad) <= 0) {
      nuevosErrores.cantidad = 'La cantidad debe ser un número mayor a 0';
      valido = false;
    }

    // Validar precio compra (requerido)
    if (!detalleActual.precioCompra) {
      nuevosErrores.precioCompra = 'El precio de compra es obligatorio';
      valido = false;
    } else if (isNaN(detalleActual.precioCompra) || parseFloat(detalleActual.precioCompra) < 0) {
      nuevosErrores.precioCompra = 'El precio debe ser un número válido';
      valido = false;
    }

    // Validar precio venta (requerido)
    if (!detalleActual.precioVenta) {
      nuevosErrores.precioVenta = 'El precio de venta es obligatorio';
      valido = false;
    } else if (isNaN(detalleActual.precioVenta) || parseFloat(detalleActual.precioVenta) < 0) {
      nuevosErrores.precioVenta = 'El precio debe ser un número válido';
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  // Agregar producto al detalle
  const agregarDetalle = () => {
    if (!validarDetalle()) {
      return;
    }

    const producto = productos.find(p => p.id_producto === parseInt(detalleActual.idProducto));
    if (!producto) return;

    const nuevoDetalle = {
      id: Date.now(), // ID temporal para React
      idProducto: parseInt(detalleActual.idProducto),
      producto: producto.descripcion,
      cantidad: parseFloat(detalleActual.cantidad),
      precioCompra: parseFloat(detalleActual.precioCompra),
      precioVenta: parseFloat(detalleActual.precioVenta)
    };

    setDetalles(prev => [...prev, nuevoDetalle]);

    // Resetear formulario de detalle
    setDetalleActual({
      idProducto: '',
      cantidad: '',
      precioCompra: '',
      precioVenta: ''
    });

    // Limpiar errores
    setErrores({
      producto: '',
      cantidad: '',
      precioCompra: '',
      precioVenta: ''
    });
  };

  // Eliminar producto del detalle
  const eliminarDetalle = (id) => {
    setDetalles(prev => prev.filter(d => d.id !== id));
  };



  // Aplicar filtros
  const aplicarFiltros = () => {
    let filtrados = [...movimientos];

    if (filtroTipo) {
      filtrados = filtrados.filter(mov =>
        mov.entrada_salida === parseInt(filtroTipo)
      );
    }

    setMovimientosFiltrados(filtrados);
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltroTipo('');
    setMovimientosFiltrados(movimientos);
    setCurrentPage(1);
  };


  // POR ESTA (si el backend devuelve números):
  const obtenerTipoMovimiento = (tipo) => {
    if (tipo === 'ENTRADA' || tipo === 1) return 'Entrada';
    if (tipo === 'SALIDA' || tipo === 2) return 'Salida';
    return 'Desconocido';
  };

  // Calcular total del movimiento (basado en precio de compra)
  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      return total + (detalle.precioCompra * detalle.cantidad);
    }, 0);
  };

  // Calcular valor total de venta
  const calcularTotalVenta = () => {
    return detalles.reduce((total, detalle) => {
      return total + (detalle.precioVenta * detalle.cantidad);
    }, 0);
  };

  // Paginación
  const totalItems = movimientosFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsActuales = movimientosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Manejar cambio en inputs con validación en tiempo real
  const handleInputChange = (field, value) => {
    setDetalleActual(prev => ({ ...prev, [field]: value }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Función para ver detalles de un movimiento
  // const verDetallesMovimiento = async (idMovimiento) => {
  //   setCargandoDetalles(true);
  //   setMovimientoSeleccionado(null);

  //   try {
  //     console.log(`🔍 Buscando detalles del movimiento ${idMovimiento}...`);
  //     const movimientoCompleto = await movimientosService.getById(idMovimiento);

  //     // Mapear los detalles para mostrar
  //     const detallesActivos = movimientoCompleto.detalles.filter(det => det.habilitado);
  //     const detallesInactivos = movimientoCompleto.detalles.filter(det => !det.habilitado);

  //     setMovimientoSeleccionado({
  //       ...movimientoCompleto,
  //       detallesActivos,
  //       detallesInactivos,
  //       totalActivos: detallesActivos.length,
  //       totalInactivos: detallesInactivos.length
  //     });

  //     setDetallesModal(true);
  //     console.log(`✅ Detalles cargados para movimiento ${idMovimiento}`);

  //   } catch (error) {
  //     console.error(`❌ Error al cargar detalles:`, error);
  //     alert('No se pudieron cargar los detalles del movimiento');
  //   } finally {
  //     setCargandoDetalles(false);
  //   }
  // };

  const verDetallesMovimiento = async (idMovimiento) => {
  setCargandoDetalles(true);
  setMovimientoSeleccionado(null);

  try {
    console.log(`🔍 Buscando detalles del movimiento ${idMovimiento}...`);
    const detalles = await movimientosService.getById(idMovimiento);

    // FILTRAR SEGÚN EL CAMPO "habilitado" QUE VIENE EN LA RESPUESTA
    const detallesActivos = detalles.filter(det => det.habilitado === true);
    const detallesInactivos = detalles.filter(det => det.habilitado === false);

    setMovimientoSeleccionado({
      idMovimientoCab: idMovimiento,
      detallesActivos,
      detallesInactivos,
      totalActivos: detallesActivos.length,
      totalInactivos: detallesInactivos.length
    });

    setDetallesModal(true);
    console.log(`✅ Detalles cargados:`, {
      total: detalles.length,
      activos: detallesActivos.length,
      inactivos: detallesInactivos.length
    });

  } catch (error) {
    console.error(`❌ Error al cargar detalles:`, error);
    alert('No se pudieron cargar los detalles del movimiento');
  } finally {
    setCargandoDetalles(false);
  }
};

  const guardarMovimiento = async () => {
    if (detalles.length === 0) {
      alert('Debe agregar al menos un producto al movimiento');
      return;
    }

    // Preparar datos para enviar al backend
    const movimientoParaEnviar = {
      idOperacion: 1, // ¿Esto es fijo o debería venir de algún lugar?
      idUsuario: usuarioActual.id_usuario, // Usar el usuario de sesión
      entradaSalida: cabecera.entradaSalida,
      fecha: `${cabecera.fecha}`, // Agregar hora por defecto
      detalles: detalles.map(detalle => ({
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad,
        precioCompra: detalle.precioCompra,
        precioVenta: detalle.precioVenta
      }))
    };

    console.log('📤 Enviando al backend:', movimientoParaEnviar);

    try {
      // Llamar al servicio para crear el movimiento
      const resultado = await movimientosService.create(movimientoParaEnviar);

      console.log('✅ Respuesta del backend:', resultado);

      // Agregar el nuevo movimiento a la lista local
      const nuevoMovimiento = {
        id_movimiento_cab: resultado.idMovimientoCab || Date.now(),
        id_usuario: usuarioActual.id_usuario,
        entrada_salida: cabecera.entradaSalida,
        codigo: resultado.codigo || `MOV-${Date.now().toString().slice(-6)}`,
        fecha: cabecera.fecha,
        cantidadProductos: detalles.length,
        tipoMovimiento: cabecera.entradaSalida === 1 ? 'ENTRADA' : 'SALIDA'
      };

      // Actualizar estado local
      const movimientosActualizados = [...movimientos, nuevoMovimiento];
      setMovimientos(movimientosActualizados);
      setMovimientosFiltrados(movimientosActualizados);

      // Resetear formulario
      setCabecera({
        entradaSalida: 1,
        fecha: new Date().toISOString().split('T')[0]
      });
      setDetalles([]);

      // Cerrar modal y mostrar mensaje
      setMostrarModal(false);
      alert('✅ Movimiento registrado exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('❌ Error al guardar movimiento:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
          Movimientos de Inventario
        </h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          style={{ backgroundColor: '#3F7416' }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Movimiento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Movimientos Hoy</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Entradas</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Salidas</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{productos.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimiento
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los tipos</option>
              <option value="1">Entradas</option>
              <option value="2">Salidas</option>
            </select>
          </div>

          <button
            onClick={aplicarFiltros}
            className="px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#3F7416' }}
          >
            Aplicar Filtros
          </button>

          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
            Historial de Movimientos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemsActuales.length > 0 ? (
                itemsActuales.map((movimiento) => {
                  // Calcular totales para este movimiento
                  const detallesMov = movimiento.detalles || [];
                  const totalCompra = detallesMov.reduce((sum, det) =>
                    sum + ((det.precio_compra || 0) * (det.cantidad || 0)), 0
                  );
                  const totalVenta = detallesMov.reduce((sum, det) =>
                    sum + ((det.precio_venta || 0) * (det.cantidad || 0)), 0
                  );

                  return (

                    <tr
                      key={movimiento.id_movimiento_cab || movimiento.idMovimientoCab}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => verDetallesMovimiento(movimiento.id_movimiento_cab || movimiento.idMovimientoCab)}
                    >

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {movimiento.codigo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${movimiento.tipoMovimiento === 'ENTRADA' || movimiento.entrada_salida === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                          }`}>
                          {obtenerTipoMovimiento(movimiento.tipoMovimiento || movimiento.entrada_salida)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movimiento.usuario || movimiento.id_usuario || 'N/A'}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-500">
                        {movimiento.cantidadProductos || (movimiento.detalles ? movimiento.detalles.length : 0)} productos
                      </td> */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span>{movimiento.cantidadProductos || (movimiento.detalles ? movimiento.detalles.length : 0)} productos</span>

                          {/* Indicador pequeño */}
                          {(movimiento.cantidadProductos > 0 || (movimiento.detalles && movimiento.detalles.length > 0)) && (
                            <span className="text-blue-500 text-xs" title="Ver detalles">🔍</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movimiento.fecha ? new Date(movimiento.fecha).toLocaleDateString('es-PE') : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-gray-600">No hay movimientos registrados</p>
                      <p className="text-sm text-gray-400 mt-1">Haz clic en "Nuevo Movimiento" para comenzar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalItems > 0 && (
          <PaginacionTabla
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {/* Modal para Nuevo Movimiento */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
                  Nuevo Movimiento de Inventario
                </h2>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Cabecera del Movimiento - Simplificada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Movimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Movimiento *
                  </label>
                  <select
                    value={cabecera.entradaSalida}
                    onChange={(e) => setCabecera(prev => ({
                      ...prev,
                      entradaSalida: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={1}>Entrada</option>
                    <option value={2}>Salida</option>
                  </select>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={new Date().toISOString().split('T')[0]}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>

                {/* Información (esto va abajo, ocupando las 2 columnas) */}
                <div className="md:col-span-2">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Usuario responsable:</strong> {usuarioActual.nombre}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      El código del movimiento será generado automáticamente por el sistema
                    </p>
                  </div>
                </div>
              </div>

              {/* Agregar Productos al Detalle */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Productos del Movimiento</h3>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                  {/* Producto */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto *
                    </label>
                    <select
                      value={detalleActual.idProducto}
                      onChange={(e) => handleInputChange('idProducto', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.producto
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                        }`}
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(producto => (
                        <option key={producto.id_producto} value={producto.id_producto}>
                          {producto.descripcion}
                        </option>
                      ))}
                    </select>
                    {errores.producto && (
                      <p className="mt-1 text-xs text-red-600">{errores.producto}</p>
                    )}
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={detalleActual.cantidad}
                      onChange={(e) => handleInputChange('cantidad', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.cantidad
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                        }`}
                      placeholder="1"
                    />
                    {errores.cantidad && (
                      <p className="mt-1 text-xs text-red-600">{errores.cantidad}</p>
                    )}
                  </div>

                  {/* Precio Compra */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Compra *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={detalleActual.precioCompra}
                      onChange={(e) => handleInputChange('precioCompra', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.precioCompra
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                        }`}
                      placeholder="0.00"
                    />
                    {errores.precioCompra && (
                      <p className="mt-1 text-xs text-red-600">{errores.precioCompra}</p>
                    )}
                  </div>

                  {/* Precio Venta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Venta *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={detalleActual.precioVenta}
                      onChange={(e) => handleInputChange('precioVenta', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.precioVenta
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                        }`}
                      placeholder="0.00"
                    />
                    {errores.precioVenta && (
                      <p className="mt-1 text-xs text-red-600">{errores.precioVenta}</p>
                    )}
                  </div>

                  {/* Botón Agregar */}
                  <div className="flex items-end">
                    <button
                      onClick={agregarDetalle}
                      className="w-full px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#3F7416' }}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Lista de Productos Agregados - SIN SUBTOTALES */}
                {detalles.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Producto
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Cantidad
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Precio Compra
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Precio Venta
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalles.map((detalle) => (
                          <tr key={detalle.id} className="border-t">
                            <td className="px-4 py-2 text-sm">{detalle.producto}</td>
                            <td className="px-4 py-2 text-sm">{detalle.cantidad}</td>
                            <td className="px-4 py-2 text-sm">
                              S/ {detalle.precioCompra.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              S/ {detalle.precioVenta.toFixed(2)}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => eliminarDetalle(detalle.id)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Totales - SIN MARGEN */}
                {detalles.length > 0 && (
                  <div className="flex justify-between mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        Productos: {detalles.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total unidades: {detalles.reduce((sum, d) => sum + d.cantidad, 0)}
                      </div>
                    </div>
                    {/* <div className="text-right">
                      <div className="text-lg font-semibold text-green-700">
                        Total gasto Compra: S/ {calcularTotal().toFixed(2)}
                      </div>
                      <div className="text-lg font-semibold text-blue-700">
                        Total ganancia Venta: S/ {calcularTotalVenta().toFixed(2)}
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarMovimiento}
                disabled={detalles.length === 0}
                className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#3F7416' }}
              >
                <Save className="w-4 h-4" />
                Guardar Movimiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del movimiento */}
      {detallesModal && movimientoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
                    Detalles del Movimiento
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Código: <span className="font-medium">{movimientoSeleccionado.codigo}</span> |
                    Tipo: <span className="font-medium">{obtenerTipoMovimiento(movimientoSeleccionado.entradaSalida)}</span> |
                    Fecha: <span className="font-medium">
                      {new Date(movimientoSeleccionado.fecha).toLocaleDateString('es-PE')}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDetallesModal(false);
                    setMovimientoSeleccionado(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Usuario</p>
                  <p className="text-lg">{movimientoSeleccionado.idUsuario || 'N/A'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Productos Activos</p>
                  <p className="text-lg">{movimientoSeleccionado.totalActivos || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-800 font-medium">Estado</p>
                  <p className="text-lg">
                    {movimientoSeleccionado.habilitado ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>

              {/* Detalles activos */}
              {movimientoSeleccionado.detallesActivos && movimientoSeleccionado.detallesActivos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3 text-green-700">
                    Productos Activos ({movimientoSeleccionado.detallesActivos.length})
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio Compra</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio Venta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimientoSeleccionado.detallesActivos.map((detalle) => {
                          return (
                            <tr key={detalle.idDetMovimiento} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm">{detalle.descripcion}</td>
                              <td className="px-4 py-2 text-sm">{detalle.cantidad}</td>
                              <td className="px-4 py-2 text-sm">S/ {detalle.precioCompra.toFixed(2)}</td>
                              <td className="px-4 py-2 text-sm">S/ {detalle.precioVenta.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* <tfoot className="bg-gray-100">
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-sm font-medium text-right">Total:</td>
                          <td className="px-4 py-2 text-sm font-medium">
                            S/ {movimientoSeleccionado.detallesActivos.reduce((sum, det) =>
                              sum + (det.cantidad * det.precioCompra), 0
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot> */}
                    </table>
                  </div>
                </div>
              )}

              {/* Detalles inactivos (si existen) */}
              {movimientoSeleccionado.detallesInactivos && movimientoSeleccionado.detallesInactivos.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-red-700">
                    Productos Inactivos/Anulados ({movimientoSeleccionado.detallesInactivos.length})
                  </h3>
                  <div className="border rounded-lg overflow-hidden border-red-200">
                    <table className="w-full">
                      <thead className="bg-red-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-red-700">Producto</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-red-700">Cantidad</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-red-700">Precio Compra</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-red-700">Precio Venta</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-red-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimientoSeleccionado.detallesInactivos.map((detalle) => (
                          <tr key={detalle.idMovimientoDet} className="border-t hover:bg-red-50">
                            <td className="px-4 py-2 text-sm">{detalle.descripcion}</td>
                            <td className="px-4 py-2 text-sm">{detalle.cantidad}</td>
                            <td className="px-4 py-2 text-sm">S/ {detalle.precioCompra.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm">S/ {detalle.precioVenta.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Inactivo
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Si no hay detalles */}
              {(!movimientoSeleccionado.detallesActivos || movimientoSeleccionado.detallesActivos.length === 0) &&
                (!movimientoSeleccionado.detallesInactivos || movimientoSeleccionado.detallesInactivos.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No hay detalles disponibles para este movimiento</p>
                  </div>
                )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setDetallesModal(false);
                  setMovimientoSeleccionado(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovimientosInventario;