import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  Filter
} from 'lucide-react';
import { ModalInventario } from '../components/modales';

const Inventario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  // Categorías según la BD
  const [categorias] = useState([
    { id_cat: 1, descripcion: 'Frutas' },
    { id_cat: 2, descripcion: 'Verduras' },
    { id_cat: 3, descripcion: 'Carnes' },
    { id_cat: 4, descripcion: 'Aseo' },
    { id_cat: 5, descripcion: 'Embutidos' },
    { id_cat: 6, descripcion: 'Panadería' },
    { id_cat: 7, descripcion: 'Bebidas' },
    { id_cat: 8, descripcion: 'Abarrotes' },
    { id_cat: 9, descripcion: 'Lácteos' }
  ]);

  // Datos de ejemplo para el inventario
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Coca Cola 500ml',
      category: 'Bebidas',
      sku: 'CC500',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      price: 3.50,
      supplier: 'Coca Cola Company',
      lastUpdated: '2024-01-15',
      status: 'normal'
    },
    {
      id: 2,
      name: 'Pan Integral',
      category: 'Panadería',
      sku: 'PI001',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      price: 4.20,
      supplier: 'Panadería Central',
      lastUpdated: '2024-01-14',
      status: 'low'
    },
    {
      id: 3,
      name: 'Arroz Extra 1kg',
      category: 'Abarrotes',
      sku: 'AR1KG',
      currentStock: 25,
      minStock: 10,
      maxStock: 80,
      price: 5.80,
      supplier: 'Distribuidora Norte',
      lastUpdated: '2024-01-13',
      status: 'normal'
    },
    {
      id: 4,
      name: 'Leche Entera 1L',
      category: 'Lácteos',
      sku: 'LE1L',
      currentStock: 2,
      minStock: 12,
      maxStock: 60,
      price: 4.90,
      supplier: 'Gloria',
      lastUpdated: '2024-01-12',
      status: 'critical'
    }
  ]);

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

  const handleSave = (productData) => {
    const categoria = categorias.find(cat => cat.id_cat === parseInt(productData.id_cat));
    
    if (editingProduct) {
      // Editar producto existente
      setInventoryItems(inventoryItems.map(item => 
        item.id === editingProduct.id
          ? {
              ...item,
              name: productData.descripcion,
              id_cat: parseInt(productData.id_cat),
              category: categoria.descripcion,
              price: parseFloat(productData.precio),
              currentStock: parseInt(productData.stock),
              lastUpdated: productData.fecha,
              habilitado: productData.habilitado
            }
          : item
      ));
    } else {
      // Crear nuevo producto
      const newItem = {
        id: inventoryItems.length + 1,
        name: productData.descripcion,
        id_cat: parseInt(productData.id_cat),
        category: categoria.descripcion,
        sku: `P${String(inventoryItems.length + 1).padStart(3, '0')}`,
        currentStock: parseInt(productData.stock),
        minStock: 10,
        maxStock: 100,
        price: parseFloat(productData.precio),
        supplier: 'Proveedor General',
        lastUpdated: productData.fecha,
        status: parseInt(productData.stock) <= 20 ? 'low' : 'normal',
        habilitado: productData.habilitado
      };
      setInventoryItems([...inventoryItems, newItem]);
    }

    setShowModal(false);
    setEditingProduct(null);
  };

  const handleEdit = (item) => {
    setEditingProduct(item);
    setShowModal(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setInventoryItems(inventoryItems.map(item => 
        item.id === itemId 
          ? { ...item, habilitado: false }
          : item
      ));
    }
  };



  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const isEnabled = item.habilitado !== false;
    return matchesSearch && matchesCategory && isEnabled;
  });

  const totalItems = inventoryItems.filter(item => item.habilitado !== false).length;
  const lowStockItems = inventoryItems.filter(item => (item.status === 'low' || item.status === 'critical') && item.habilitado !== false).length;
  const totalValue = inventoryItems.filter(item => item.habilitado !== false).reduce((sum, item) => sum + (item.currentStock * item.price), 0);

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
            Gestión y control de stock de productos
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: '#3F7416' }}
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
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

      {/* Modal Inventario */}
      <ModalInventario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingProduct={editingProduct}
        onSave={handleSave}
        categorias={categorias}
      />
    </div>
  );
};

export default Inventario;