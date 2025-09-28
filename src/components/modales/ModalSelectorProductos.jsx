import React, { useState } from 'react';
import { X, Search, Package } from 'lucide-react';

const ModalSelectorProductos = ({ isOpen, onClose, onSelect, productos = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = productos.filter(product =>
    product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id_producto.toString().includes(searchTerm) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product) => {
    onSelect(product);
    setSearchTerm('');
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F0F8E8' }}>
              <Package className="w-5 h-5" style={{ color: '#3F7416' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
              Seleccionar Producto
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#3F7416' }}
              autoFocus
            />
          </div>
        </div>

        {/* Products List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay productos disponibles'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <button
                  key={product.id_producto}
                  onClick={() => handleProductSelect(product)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-green-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0F8E8' }}>
                        <Package className="w-6 h-6" style={{ color: '#3F7416' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-left">
                          {product.descripcion}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>ID: {product.id_producto}</span>
                          <span>Stock: {product.stock}</span>
                          <span>Precio: S/ {product.precio.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#F0F8E8', color: '#3F7416' }}>
                        {product.categoria}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} 
              {searchTerm ? ' encontrado' + (filteredProducts.length !== 1 ? 's' : '') : ' disponible' + (filteredProducts.length !== 1 ? 's' : '')}
            </span>
            <span className="text-xs">
              Haz clic en un producto para seleccionarlo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSelectorProductos;