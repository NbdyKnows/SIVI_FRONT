
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';
//import inventarioService from '../services/inventarioService'; 
import productosService from '../services/productosService';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

 

    const getProductDisplay = (categoria) => {
      const displayMap = {
        'Frutas': { emoji: '🍎', color: 'from-red-50 to-red-100' },
        'Verduras': { emoji: '🥬', color: 'from-green-50 to-green-100' },
        'Carnes': { emoji: '🥩', color: 'from-rose-50 to-rose-100' },
        'Aseo': { emoji: '🧼', color: 'from-blue-50 to-blue-100' },
        'Embutidos': { emoji: '🌭', color: 'from-orange-50 to-orange-100' },
        'Panadería': { emoji: '🍞', color: 'from-amber-50 to-amber-100' },
        'Bebidas': { emoji: '🥤', color: 'from-cyan-50 to-cyan-100' },
        'Abarrotes': { emoji: '🛒', color: 'from-purple-50 to-purple-100' },
        'Lácteos': { emoji: '🥛', color: 'from-sky-50 to-sky-100' }
      };

      return displayMap[categoria] || { emoji: '📦', color: 'from-gray-50 to-gray-100' };
    };

  useEffect(() => {
    

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const response = await productosService.getCatalogo();
        console.log('Datos del backend para productos:', response);

        // Asegurarnos de obtener el array de datos
        const datos = response.data || response;
        setProductos(datos);

        // Extraer categorías únicas de los productos (si existen)
        // Si no viene categoría en los datos, puedes manejarlo de otra forma
        const categoriasUnicas = [...new Set(datos
          .filter(item => item.producto)
          .map(item => {
            // Si no tienes categorías en el endpoint actual,
            // podrías crear categorías basadas en el estado_stock u otro campo
            return item.categoria || 'Sin categoría';
          }))];

        setCategorias(categoriasUnicas);
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
        console.error('Error:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para obtener el estado del stock (similar a Inventario)
  const getStockStatus = (stock, stock_minimo = 20) => {
    if (stock <= stock_minimo) return {
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: 'Bajo',
      priority: 1
    };
    if (stock <= stock_minimo * 2) return {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: 'Medio',
      priority: 2
    };
    return {
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Alto',
      priority: 3
    };
  };

  // Filtrar productos
  // Filtrar productos CORRECTAMENTE
  const filteredProducts = productos.filter(product => {
    // Verificar si el producto coincide con la búsqueda
    const matchesSearch = product.producto?.toLowerCase().includes(searchTerm.toLowerCase());

    // Verificar si coincide con la categoría seleccionada
    const matchesCategory = selectedCategory === 'Todas' ||
      product.categoria === selectedCategory; // ¡Usar CATEGORÍA!

    // Solo incluir productos que cumplan AMBAS condiciones
    return matchesSearch && matchesCategory;
  });

  // Si está cargando
  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: '#3F7416' }} />
          <p className="text-gray-600 text-sm">Cargando catálogo de productos...</p>
        </div>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-red-800 font-medium">Error al cargar productos</h3>
          </div>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 mt-1">
            {productos.length} productos en inventario
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barra de búsqueda */}
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

          {/* Filtro por categoría/estado */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[180px]"
            >
              <option value="Todas">Categorias</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pestañas de categorías/estados */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === 'Todas'
              ? 'text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            style={{
              backgroundColor: selectedCategory === 'Todas' ? '#633416' : undefined
            }}
          >
            Todos
          </button>
          {categorias.map((categoria, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(categoria)}
              className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === categoria
                ? 'text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              style={{
                backgroundColor: selectedCategory === categoria ? '#633416' : undefined
              }}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock_actual);
          const display = getProductDisplay(product.categoria);

          return (
            <div
              key={product.id_producto}
              className="group bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Imagen del producto con emoji y color de categoría */}
              <div className={`h-48 ${display.color} flex items-center justify-center relative`}>
                {/* Emoji grande de la categoría */}
                <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {display.emoji}
                </div>

                {/* Badge de reposición */}
                {product.stock_actual <= 20 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    ¡Reponer!
                  </div>
                )}

                {/* Badge de categoría */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200">
                    {product.categoria}
                  </span>
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {product.producto}
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stock actual:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {product.stock_actual}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Precio venta:</span>
                    <span className="text-sm font-semibold" style={{ color: '#3F7416' }}>
                      S/. {product.precio_venta?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Categoría:</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${display.bgColor} ${display.textColor}`}>
                      {product.categoria}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Código:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {`P${product.id_producto?.toString().padStart(3, '0') || '000'}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sin resultados */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No hay productos que coincidan con "${searchTerm}"`
              : 'No hay productos disponibles con los filtros seleccionados'}
          </p>
          {(searchTerm || selectedCategory !== 'Todas') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="mt-4 px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Productos;