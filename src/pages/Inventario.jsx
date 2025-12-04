import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  AlertTriangle,
  TrendingUp,
  Filter,
  PackagePlus
} from 'lucide-react';
import colors from '../styles/colors';
import inventarioService from '../services/inventarioService';

const Inventario = () => {
  const navigate = useNavigate();
  
  const [datosBackend, setDatosBackend] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const response = await inventarioService.getDetallePanel();
        console.log('Datos del backend:', response);
        setDatosBackend(response.data || response);
      } catch (err) {
        setError(err.message || 'Error al cargar inventario');
        console.error('Error:', err);
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando inventario real...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar inventario</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Formatear datos del backend
  const inventoryItems = datosBackend.map(item => {
    // Determinar si requiere atención
    const requiereAtencion = item.estado_stock === 'Requiere reposición';
    
    return {
      id: item.id_inventario,
      id_producto: item.id_producto,
      name: item.producto || `Producto ${item.id_producto}`,
      category: 'General',
      sku: `P${item.id_producto?.toString().padStart(3, '0') || '000'}`,
      currentStock: item.stock_actual,
      minStock: item.stock_minimo,
      price: item.precio_venta,
      fechaIngreso: item.fecha_ingreso,
      estadoStock: item.estado_stock,
      requiereAtencion: requiereAtencion
    };
  });

  // Función para color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Requiere reposición':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Stock suficiente':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para color de stock crítico
  const getStockColor = (stockActual, stockMinimo) => {
    if (stockActual <= stockMinimo) {
      return 'text-red-600 font-bold';
    }
    return 'text-gray-900';
  };

  // Filtrar items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.estadoStock.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Estadísticas
  const totalItems = inventoryItems.length;
  const requiereStockItems = inventoryItems.filter(item => item.requiereAtencion).length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock ), 0);

  const categories = ['all', ...new Set(inventoryItems.map(item => item.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
            Inventario
          </h1>
          <p className="text-gray-600 mt-1">
            {totalItems} productos • {requiereStockItems} requieren atención
          </p>
        </div>
        <button hidden
          onClick={() => navigate('/app/inventario/agregar-stock')}
          className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
          style={{ backgroundColor: colors.primary.green }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.states.hover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary.green;
          }}
        >
          <PackagePlus className="w-5 h-5" />
          Gestión de Stock
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>
                {totalItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <Package className="w-6 h-6" style={{ color: '#3F7416' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requieren Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {requiereStockItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>
                 {totalValue.toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <TrendingUp className="w-6 h-6" style={{ color: '#3F7416' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 ${item.requiereAtencion ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${item.requiereAtencion ? 'bg-red-100' : 'bg-gray-100'}`}>
                        <Package className={`w-5 h-5 ${item.requiereAtencion ? 'text-red-500' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    S/. {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`font-medium ${getStockColor(item.currentStock, item.minStock)}`}>
                        {item.currentStock}
                      </span>
                      {item.currentStock <= item.minStock && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.fechaIngreso).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getEstadoColor(item.estadoStock)}`}>
                      {item.estadoStock}
                    </span>
                    {item.requiereAtencion && (
                      <AlertTriangle className="inline-block w-4 h-4 ml-2 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && !cargando && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta cambiar los filtros de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
};

export default Inventario;