import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package,
  Loader2,
  Tag
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import productosService from '../services/productosService';
import inventarioService from '../services/inventarioService';
import categoriasService from '../services/categoriasService';
import { ModalCategorias } from '../components/modales';

const Productos = () => {
  const { getCategorias } = useDatabase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);

  // Cargar productos e inventario desde la API
  const cargarProductos = async () => {
    setIsLoading(true);
    try {
      const [productosData, inventarioData, categoriasData] = await Promise.all([
        productosService.getAll(),
        inventarioService.getAll(),
        categoriasService.getAll()
      ]);

      console.log('📦 Productos:', productosData);
      console.log('📊 Inventario:', inventarioData);
      console.log('🏷️ Categorías:', categoriasData);
      console.log('🏷️ Tipo de Categorías:', typeof categoriasData, Array.isArray(categoriasData));

      // Guardar categorías
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);

      // Crear mapa de inventario (incluir todos, no solo habilitados)
      const inventarioMap = {};
      (inventarioData || []).forEach(inv => {
        // Guardar el último inventario por producto (puede haber varios registros)
        if (!inventarioMap[inv.idProducto] || inventarioMap[inv.idProducto].idInventario < inv.idInventario) {
          inventarioMap[inv.idProducto] = inv;
        }
      });

      // Crear mapa de categorías
      const categoriasMap = {};
      (Array.isArray(categoriasData) ? categoriasData : []).forEach(cat => {
        categoriasMap[cat.idCat] = cat.descripcion;
      });

      console.log('🗺️ Mapa de Inventario:', inventarioMap);
      console.log('🗺️ Mapa de Categorías:', categoriasMap);

      // Combinar productos con inventario y categorías
      const productosFormateados = productosData
        .filter(p => p.habilitado)
        .map(producto => {
          const inv = inventarioMap[producto.idProducto];
          
          return {
            id_producto: producto.idProducto,
            idProducto: producto.idProducto,
            descripcion: producto.descripcion,
            id_cat: producto.idCat,
            categoria: categoriasMap[producto.idCat] || 'Sin categoría',
            stock: inv?.stock || 0,
            precio: inv?.precio || 0,
            habilitado: producto.habilitado,
            sku: producto.codigo || `P${String(producto.idProducto).padStart(3, '0')}`,
            stockMinimo: producto.stockMinimo || 20,
            tieneInventario: !!inv
          };
        });

      console.log('✅ Productos Formateados:', productosFormateados);
      console.log('📊 Total de productos:', productosFormateados.length);
      setProductos(productosFormateados);

    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      // Fallback a datos locales
      cargarProductosLocales();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback: cargar desde JSON local
  const cargarProductosLocales = () => {
    try {
      const categoriasLocales = getCategorias();
      setCategorias(categoriasLocales);
      setProductos([]);
    } catch (error) {
      console.error('Error al cargar datos locales:', error);
      setCategorias([]);
      setProductos([]);
    }
  };

  // Buscar productos por término
  const buscarProductos = async (query) => {
    if (!query || query.trim().length < 1) {
      cargarProductos();
      return;
    }

    setIsLoading(true);
    try {
      const [resultados, inventarioData] = await Promise.all([
        productosService.search(query),
        inventarioService.getAll()
      ]);

      // Crear mapa de inventario (incluir todos)
      const inventarioMap = {};
      inventarioData.forEach(inv => {
        if (!inventarioMap[inv.idProducto] || inventarioMap[inv.idProducto].idInventario < inv.idInventario) {
          inventarioMap[inv.idProducto] = inv;
        }
      });

      // Crear mapa de categorías (usar las ya cargadas)
      const categoriasMap = {};
      categorias.forEach(cat => {
        categoriasMap[cat.idCat] = cat.descripcion;
      });

      const productosFormateados = resultados
        .filter(p => p.habilitado)
        .map(producto => {
          const inv = inventarioMap[producto.idProducto];
          
          return {
            id_producto: producto.idProducto,
            idProducto: producto.idProducto,
            descripcion: producto.descripcion,
            id_cat: producto.idCat,
            categoria: categoriasMap[producto.idCat] || 'Sin categoría',
            stock: inv?.stock || 0,
            precio: inv?.precio || 0,
            habilitado: producto.habilitado,
            sku: producto.codigo || `P${String(producto.idProducto).padStart(3, '0')}`,
            stockMinimo: producto.stockMinimo || 20
          };
        });

      setProductos(productosFormateados);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos al montar
  useEffect(() => {
    cargarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        buscarProductos(searchTerm);
      } else {
        cargarProductos();
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Filtrar por categoría localmente
  const filteredProducts = selectedCategory === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === selectedCategory);

  // Handler para cuando se crea/edita una categoría
  const handleCategoriaActualizada = () => {
    cargarProductos(); // Recargar productos para actualizar categorías
  };

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
        <button
          onClick={() => setShowCategoriasModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: '#633416' }}
        >
          <Tag className="w-5 h-5" />
          Gestionar Categorías
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
              key={categoria.idCat}
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
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-3 text-gray-600">Cargando productos...</span>
        </div>
      ) : (
        <>
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
                          {product.sku}
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
        </>
      )}

      {/* Modal de Gestión de Categorías */}
      <ModalCategorias
        isOpen={showCategoriasModal}
        onClose={() => setShowCategoriasModal(false)}
        onCategoriaCreada={handleCategoriaActualizada}
      />
    </div>
  );
};

export default Productos;