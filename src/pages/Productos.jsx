import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Package,
  Eye
} from 'lucide-react';

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Simulando datos de la BD
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

  const productos = [
    {
      id_producto: 1,
      descripcion: 'Aceite Primor',
      id_cat: 8,
      categoria: 'Abarrotes',
      stock: 50,
      precio: 12.50,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 2,
      descripcion: 'Huevos LA CALERA',
      id_cat: 3,
      categoria: 'Carnes',
      stock: 29,
      precio: 8.50,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 3,
      descripcion: 'Pan Bimbo',
      id_cat: 6,
      categoria: 'Panadería',
      stock: 40,
      precio: 4.20,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 4,
      descripcion: 'Laive Sin Lactosa',
      id_cat: 9,
      categoria: 'Lácteos',
      stock: 75,
      precio: 5.80,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 5,
      descripcion: 'Papas INKA CHIPS',
      id_cat: 8,
      categoria: 'Abarrotes',
      stock: 30,
      precio: 3.50,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 6,
      descripcion: 'Tomate Italiano',
      id_cat: 2,
      categoria: 'Verduras',
      stock: 120,
      precio: 4.00,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 7,
      descripcion: 'Atún Florida',
      id_cat: 8,
      categoria: 'Abarrotes',
      stock: 35,
      precio: 6.80,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 8,
      descripcion: 'Cerveza PILSEN',
      id_cat: 7,
      categoria: 'Bebidas',
      stock: 31,
      precio: 4.50,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 9,
      descripcion: 'Yogurt Gloria',
      id_cat: 9,
      categoria: 'Lácteos',
      stock: 60,
      precio: 3.20,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 10,
      descripcion: 'Arroz Extra Faraón',
      id_cat: 8,
      categoria: 'Abarrotes',
      stock: 52,
      precio: 5.80,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 11,
      descripcion: 'Gaseosa Inca Kola',
      id_cat: 7,
      categoria: 'Bebidas',
      stock: 48,
      precio: 3.50,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    },
    {
      id_producto: 12,
      descripcion: 'Detergente Patito',
      id_cat: 4,
      categoria: 'Aseo',
      stock: 34,
      precio: 12.90,
      habilitado: true,
      imagen: '/api/placeholder/200/200'
    }
  ];

  const filteredProducts = productos.filter(product => {
    const matchesSearch = product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.categoria === selectedCategory;
    const isEnabled = product.habilitado;
    return matchesSearch && matchesCategory && isEnabled;
  });

  const getStockStatus = (stock) => {
    if (stock <= 20) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Bajo' };
    if (stock <= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medio' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Alto' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 mt-1">
            Visualiza el catálogo completo de productos del minimarket
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[150px]"
            >
              <option value="Todas">Todas</option>
              {categorias.map(categoria => (
                <option key={categoria.id_cat} value={categoria.descripcion}>
                  {categoria.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === 'Todas'
                ? 'text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            style={{
              backgroundColor: selectedCategory === 'Todas' ? '#633416' : undefined
            }}
          >
            Todas
          </button>
          {categorias.map(categoria => (
            <button
              key={categoria.id_cat}
              onClick={() => setSelectedCategory(categoria.descripcion)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === categoria.descripcion
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedCategory === categoria.descripcion ? '#633416' : undefined
              }}
            >
              {categoria.descripcion}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div key={product.id_producto} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.descripcion}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span className={`text-sm font-medium ${stockStatus.color}`}>
                      {product.stock}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Precio:</span>
                    <span className="text-sm font-semibold" style={{ color: '#3F7416' }}>
                      S/. {product.precio.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Estado:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                </div>
                
                {/* Product Code */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Código:</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      P{String(product.id_producto).padStart(3, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No products found */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta cambiar los filtros de búsqueda o agregar nuevos productos.
          </p>
        </div>
      )}


    </div>
  );
};

export default Productos;