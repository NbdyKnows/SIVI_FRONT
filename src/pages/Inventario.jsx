import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  Filter,
  PackagePlus
} from 'lucide-react';

import { useDatabase } from '../hooks/useDatabase';
import colors from '../styles/colors';

const Inventario = () => {
  const navigate = useNavigate();
  const { getInventarioWithProductoAndCategoria } = useDatabase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  
  // Obtener datos reales de la BD
  const inventarioData = getInventarioWithProductoAndCategoria();

  // Formatear datos del inventario real
  const inventoryItems = inventarioData.map(item => {
    const getStockStatus = (stock) => {
      if (stock <= 10) return 'critical';
      if (stock <= 20) return 'low';
      return 'normal';
    };

    return {
      id: item.id_inventario,
      id_producto: item.id_producto,
      name: item.producto,
      category: item.categoria,
      sku: item.sku,
      currentStock: item.stock,
      minStock: 10, // Valor por defecto
      maxStock: 100, // Valor por defecto
      price: item.precio,
      supplier: 'Proveedor General', // Podríamos obtener esto de la BD si está disponible
      lastUpdated: item.fecha_movimiento || new Date().toISOString(),
      status: getStockStatus(item.stock),
      habilitado: item.habilitado
    };
  }).filter(item => item.habilitado);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical':
        return 'Crítico';
      case 'low':
        return 'Bajo';
      default:
        return 'Normal';
    }
  };

  // Inventario ahora es solo para visualización
  // Las funciones de edición/creación están en la página de Gestión de Stock



  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low' || item.status === 'critical').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

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
            Visualización y control de productos en inventario
          </p>
        </div>
        <button
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
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-red-600">
                {lowStockItems}
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
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold" style={{ color: '#3F7416' }}>
                S/. {totalValue.toFixed(2)}
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
                placeholder="Buscar por nombre o SKU..."
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
                  Nombre de Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilidad
                </th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-gray-500" />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{item.currentStock}</span>
                      {item.currentStock <= item.minStock && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastUpdated).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
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