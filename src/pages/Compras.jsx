import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Package, AlertCircle, Plus, Eye, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import comprasService from '../services/comprasService';
import productosService from '../services/productosService';
import { API_BASE_URL } from '../config/appConfig';
import PaginacionTabla from '../components/PaginacionTabla';
import FiltrosFecha from '../components/FiltrosFecha';
import ModalNuevaCompra from '../components/modales/ModalNuevaCompra';
import { ModalAgregarProveedor, ModalProveedor } from '../components/modales';

const Compras = () => {
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState(null);

  const COLOR_VERDE = '#3F7416';
  const COLOR_VERDE_HOVER = '#2F5A10';

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      const comprasData = await comprasService.listarCompras();
      const listaCompras = Array.isArray(comprasData) ? comprasData : [];
      setCompras(listaCompras);
      setComprasFiltradas(listaCompras);

      try {
        const resProv = await fetch(`${API_BASE_URL}/proveedor`, { headers });
        if (resProv.ok) {
          const provData = await resProv.json();
          console.log('Proveedores cargados:', provData); // Logging para debug
          setProveedores(Array.isArray(provData) ? provData : []);
        } else {
          console.error('Error en respuesta de proveedores:', resProv.status);
          setProveedores([]);
        }
      } catch (error) {
        console.error('Error cargando proveedores:', error);
        setProveedores([]);
      }

      try {
        const prodData = await productosService.getAll();
        console.log('Productos cargados:', prodData); // Logging para debug
        setProductos(Array.isArray(prodData) ? prodData : []);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProductos([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los datos del servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const aplicarFiltros = () => {
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
      filtradas = filtradas.filter(compra => new Date(compra.fecha) >= fechaInicio);
    }
    if (filtroFechaHasta) {
      const fechaFin = new Date(filtroFechaHasta);
      fechaFin.setHours(23, 59, 59, 999);
      filtradas = filtradas.filter(compra => new Date(compra.fecha) <= fechaFin);
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

  const handleCompraExitosa = () => {
    cargarDatos();
    setMostrarModalCompra(false);
  };

  const handleAprobarCompra = async (idOrden) => {
    if (!window.confirm("¿Estás seguro de aprobar esta orden?")) return;
    try {
      await comprasService.aprobarCompra(idOrden);
      alert("Orden aprobada y stock actualizado.");
      cargarDatos();
    } catch (error) {
      alert("Error al aprobar: " + error.message);
    }
  };

  const handleAnularCompra = async (idOrden) => {
    if (!window.confirm("¿Deseas anular esta orden?")) return;
    try {
      await comprasService.anularCompra(idOrden);
      alert("Orden anulada correctamente.");
      cargarDatos();
    } catch (error) {
      alert("Error al anular: " + error.message);
    }
  };

  const handleAgregarProveedor = () => {
    cargarDatos();
    setMostrarModal(false);
  };

  const handleActualizarProveedor = () => {
    cargarDatos();
    setMostrarModalEditar(false);
  };
  
  const handleEditarProveedor = (proveedor) => {
    setProveedorAEditar(proveedor);
    setMostrarModalEditar(true);
  };

  const obtenerNombreProveedor = (proveedorObj) => {
    if (!proveedorObj) return 'Desconocido';
    if (typeof proveedorObj === 'object') return proveedorObj.descripcion;
    const prov = proveedores.find(p => p.id_proveedor === proveedorObj);
    return prov ? prov.descripcion : `ID: ${proveedorObj}`;
  };

  const datosActuales = vistaActual === 'proveedores' ? proveedores : comprasFiltradas;
  const totalItems = datosActuales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const itemsActuales = datosActuales.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading && compras.length === 0 && proveedores.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      );
  }

  const renderResumen = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Compras (Histórico)</p>
              <p className="text-2xl font-bold text-gray-900">
                S/ {compras.filter(c => c.habilitado).reduce((acc, c) => acc + (c.total || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => setVistaActual('proveedores')}>
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/app/productos')}>
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes Aprobación</p>
              <p className="text-2xl font-bold text-gray-900">
                {compras.filter(c => !c.aprobado && c.habilitado).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
  );

  const renderTablaCompras = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <FiltrosFecha
          fechaDesde={filtroFechaDesde}
          fechaHasta={filtroFechaHasta}
          onFechaDesdeChange={setFiltroFechaDesde}
          onFechaHastaChange={setFiltroFechaHasta}
          onAplicarFiltros={aplicarFiltros}
          onLimpiarFiltros={limpiarFiltros}
        />
        <button
          onClick={cargarDatos}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          title="Actualizar lista"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>Historial de Compras</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemsActuales.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay compras registradas</td></tr>
              ) : (
                itemsActuales.map((compra) => (
                  <tr key={compra.idOrdenCompra} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{compra.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {obtenerNombreProveedor(compra.proveedor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full 
                        ${compra.aprobado 
                          ? 'bg-green-100 text-green-800'
                          : !compra.habilitado
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'}`}>
                        {compra.aprobado ? 'Aprobado' : (!compra.habilitado ? 'Anulado' : 'Pendiente')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">S/ {compra.total?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {compra.fecha ? new Date(compra.fecha).toLocaleDateString('es-PE') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center gap-2">
                        {!compra.aprobado && compra.habilitado && (
                            <>
                            <button
                                onClick={() => handleAprobarCompra(compra.idOrdenCompra)}
                                className="text-green-600 hover:text-green-900 font-medium px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors"
                                title="Aprobar y actualizar Stock"
                            >
                                Aprobar
                            </button>
                            <button
                                onClick={() => handleAnularCompra(compra.idOrdenCompra)}
                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                title="Anular orden"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors" title="Ver detalles">
                            <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3F7416' }}>Proveedores</h2>
          <p className="text-gray-600 mt-1">Gestiona los proveedores del sistema</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setVistaActual('')} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Regresar
          </button>
          
          <button
            onClick={() => setMostrarModal(true)}
            className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
            style={{ backgroundColor: COLOR_VERDE }}
            onMouseEnter={(e) => e.target.style.backgroundColor = COLOR_VERDE_HOVER}
            onMouseLeave={(e) => e.target.style.backgroundColor = COLOR_VERDE}
          >
            <Plus className="w-4 h-4" />
            Agregar Proveedor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemsActuales.map((proveedor) => (
                <tr key={proveedor.idProveedor} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{proveedor.idProveedor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{proveedor.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proveedor.telefono || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proveedor.documento || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${proveedor.habilitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {proveedor.habilitado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditarProveedor(proveedor)} className="p-1 text-green-600 hover:text-green-800 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
          {vistaActual === '' ? 'Compras' : 'Gestión de Proveedores'}
        </h1>
        {vistaActual === '' && (
          <button
            onClick={() => setMostrarModalCompra(true)}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: COLOR_VERDE }}
            onMouseEnter={(e) => e.target.style.backgroundColor = COLOR_VERDE_HOVER}
            onMouseLeave={(e) => e.target.style.backgroundColor = COLOR_VERDE}
          >
            Nueva Compra
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {vistaActual === '' ? (
        <>
          {renderResumen()}
          {renderTablaCompras()}
        </>
      ) : renderProveedores()}

      <ModalNuevaCompra
        isOpen={mostrarModalCompra}
        onClose={() => setMostrarModalCompra(false)}
        onSuccess={handleCompraExitosa}
        proveedores={proveedores}
        productos={productos}
      />

      <ModalAgregarProveedor
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSave={handleAgregarProveedor}
      />

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