import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Package, AlertCircle, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import database from '../data/database.json';
import PaginacionTabla from '../components/PaginacionTabla';
import FiltrosFecha from '../components/FiltrosFecha';
import { ModalAgregarProveedor, ModalProveedor } from '../components/modales';

const Compras = () => {
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState(''); // '', 'proveedores'
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para filtros
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  
  // Estados para modales
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState(null);

  useEffect(() => {
    // Cargar datos iniciales (solo proveedores habilitados)
    const proveedoresHabilitados = (database.proveedor || []).filter(p => p.habilitado);
    setProveedores(database.proveedor || []);
    setProveedoresFiltrados(proveedoresHabilitados);
    
    // Cargar compras (orden_compra_cab)
    const comprasData = database.orden_compra_cab || [];
    setCompras(comprasData);
    setComprasFiltradas(comprasData);
  }, []);

  // Aplicar filtros de fecha
  const aplicarFiltros = () => {
    // Validar que la fecha "Desde" no sea mayor que "Hasta"
    if (filtroFechaDesde && filtroFechaHasta) {
      const fechaDesde = new Date(filtroFechaDesde);
      const fechaHasta = new Date(filtroFechaHasta);
      
      if (fechaDesde > fechaHasta) {
        alert('La fecha "Desde" no puede ser mayor que la fecha "Hasta"');
        return;
      }
    }
    
    let filtradas = [...compras];
    
    if (filtroFechaDesde) {
      const fechaInicio = new Date(filtroFechaDesde);
      fechaInicio.setHours(0, 0, 0, 0);
      filtradas = filtradas.filter(compra => {
        const fechaCompra = new Date(compra.fecha);
        return fechaCompra >= fechaInicio;
      });
    }
    
    if (filtroFechaHasta) {
      const fechaFin = new Date(filtroFechaHasta);
      fechaFin.setHours(23, 59, 59, 999);
      filtradas = filtradas.filter(compra => {
        const fechaCompra = new Date(compra.fecha);
        return fechaCompra <= fechaFin;
      });
    }
    
    setComprasFiltradas(filtradas);
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
    setComprasFiltradas(compras);
    setCurrentPage(1);
  };

  const handleAgregarProveedor = (nuevoProveedor) => {
    const proveedoresActualizados = [...proveedores, nuevoProveedor];
    setProveedores(proveedoresActualizados);
    setProveedoresFiltrados(proveedoresActualizados);
    setMostrarModal(false);
  };

  const handleEditarProveedor = (proveedor) => {
    setProveedorAEditar(proveedor);
    setMostrarModalEditar(true);
  };

  const handleActualizarProveedor = (proveedorActualizado) => {
    const proveedoresActualizados = proveedores.map(p => 
      p.id_proveedor === proveedorActualizado.id_proveedor ? proveedorActualizado : p
    );
    setProveedores(proveedoresActualizados);
    setProveedoresFiltrados(proveedoresActualizados);
    setMostrarModalEditar(false);
    setProveedorAEditar(null);
  };

  const handleBorrarProveedor = (proveedor) => {
    const accion = proveedor.habilitado ? 'desactivar' : 'activar';
    const estado = proveedor.habilitado ? 'inactivo' : 'activo';
    
    if (window.confirm(`¿Está seguro que desea ${accion} el proveedor "${proveedor.descripcion}"?\n\nEsto cambiará su estado a ${estado}.`)) {
      const proveedoresActualizados = proveedores.map(p => 
        p.id_proveedor === proveedor.id_proveedor 
          ? { ...p, habilitado: !p.habilitado }
          : p
      );
      setProveedores(proveedoresActualizados);
      
      // Filtrar solo proveedores activos para la vista
      const proveedoresActivos = proveedoresActualizados.filter(p => p.habilitado);
      setProveedoresFiltrados(proveedoresActivos);
    }
  };

  const obtenerNombreProveedor = (idProveedor) => {
    const proveedor = proveedores.find(p => p.id_proveedor === idProveedor);
    return proveedor ? proveedor.descripcion : 'Proveedor no encontrado';
  };

  // Calcular datos de paginación
  const datosActuales = vistaActual === 'proveedores' ? proveedoresFiltrados : comprasFiltradas;
  const totalItems = datosActuales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsActuales = datosActuales.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const render = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Compras Mes</p>
              <p className="text-2xl font-bold text-gray-900">S/ 8,450</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setVistaActual('proveedores')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Proveedores</p>
              <p className="text-2xl font-bold text-gray-900">{proveedores.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Truck className="w-6 h-6" style={{ color: '#3F7416' }} />
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => navigate('/app/productos')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{database.producto?.length || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de fecha */}
      <FiltrosFecha
        fechaDesde={filtroFechaDesde}
        fechaHasta={filtroFechaHasta}
        onFechaDesdeChange={setFiltroFechaDesde}
        onFechaHastaChange={setFiltroFechaHasta}
        onAplicarFiltros={aplicarFiltros}
        onLimpiarFiltros={limpiarFiltros}
      />

      {/* Recent Purchases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
            Compras Recientes
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
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemsActuales.map((compra) => (
                <tr key={compra.id_orden_compra} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {compra.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {obtenerNombreProveedor(compra.id_proveedor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      compra.aprobado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {compra.aprobado ? 'Aprobado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    S/ {compra.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(compra.fecha).toLocaleDateString('es-PE')}
                  </td>
                </tr>
              ))}
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
    </>
  );

  const renderProveedores = () => (
    <>
      {/* Header Proveedores */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3F7416' }}>Proveedores</h2>
          <p className="text-gray-600 mt-1">Gestiona los proveedores del sistema</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setVistaActual('')}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Regresar 
          </button>
          <button
            onClick={() => setMostrarModal(true)}
            className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#3F7416' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2F5A10'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416'}
          >
            <Plus className="w-4 h-4" />
            Agregar Proveedor
          </button>
        </div>
      </div>

      {/* Tabla Proveedores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemsActuales.map((proveedor) => (
                <tr key={proveedor.id_proveedor} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{proveedor.id_proveedor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proveedor.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proveedor.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      proveedor.habilitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {proveedor.habilitado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditarProveedor(proveedor)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Editar proveedor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleBorrarProveedor(proveedor)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title={proveedor.habilitado ? 'Desactivar proveedor' : 'Activar proveedor'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
          {vistaActual === '' ? 'Compras' : 'Gestión de Proveedores'}
        </h1>
        {vistaActual === '' && (
          <button
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#3F7416' }}
          >
            Nueva Compra
          </button>
        )}
      </div>

      {/* Contenido dinámico */}
      {vistaActual === '' ? render() : renderProveedores()}

      {/* Modal Agregar Proveedor */}
      <ModalAgregarProveedor
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSave={handleAgregarProveedor}
      />

      {/* Modal Editar Proveedor */}
      <ModalProveedor
        isOpen={mostrarModalEditar}
        onClose={() => {
          setMostrarModalEditar(false);
          setProveedorAEditar(null);
        }}
        onSave={handleActualizarProveedor}
        proveedor={proveedorAEditar}
      />
    </div>
  );
};

export default Compras;