import React, { useState } from 'react';
import { 
  Plus,
  Package,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { ModalSelectorProductos } from '../components/modales';

const AgregarStock = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [stockEntry, setStockEntry] = useState({
    id_producto: '',
    cantidad: '',
    precio: '',
    fecha: new Date().toISOString().split('T')[0],
    id_proveedor: '',
    notes: ''
  });

  // Productos disponibles basados en la BD (tabla producto + inventario)
  const availableProducts = [
    {
      id_producto: 1,
      descripcion: 'Aceite Primor',
      id_cat: 8,
      categoria: 'Abarrotes',
      stock: 50,
      precio: 12.50
    },
    {
      id_producto: 2,
      descripcion: 'Huevos LA CALERA',
      id_cat: 3,
      categoria: 'Carnes',
      stock: 29,
      precio: 8.50
    },
    {
      id_producto: 3,
      descripcion: 'Pan Bimbo',
      id_cat: 6,
      categoria: 'Panadería',
      stock: 40,
      precio: 4.20
    },
    {
      id_producto: 4,
      descripcion: 'Laive Sin Lactosa',
      id_cat: 9,
      categoria: 'Lácteos',
      stock: 75,
      precio: 5.80
    },
    {
      id_producto: 5,
      descripcion: 'Papas INKA CHIPS',
      id_cat: 8,
      categoria: 'Abarrotes',
      stock: 30,
      precio: 3.50
    }
  ];

  // Proveedores disponibles basados en la BD (tabla proveedor)
  const [proveedores] = useState([
    { id_proveedor: 1, descripcion: 'Distribuidora Norte', telefono: '987654321' },
    { id_proveedor: 2, descripcion: 'Coca Cola Company', telefono: '912345678' },
    { id_proveedor: 3, descripcion: 'Panadería Central', telefono: '945678912' },
    { id_proveedor: 4, descripcion: 'Gloria S.A.', telefono: '998877665' },
    { id_proveedor: 5, descripcion: 'Alicorp S.A.A.', telefono: '966554433' }
  ]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setStockEntry({
      ...stockEntry,
      id_producto: product.id_producto
    });
    setShowProductSelector(false);
  };

  const handleInputChange = (field, value) => {
    setStockEntry({
      ...stockEntry,
      [field]: value
    });
  };

  const handleSave = () => {
    if (!selectedProduct || !stockEntry.cantidad || !stockEntry.precio || !stockEntry.id_proveedor) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Simular creación de movimiento_cab y movimiento_det según BD
    const movimientoCab = {
      id_movimiento_cab: Date.now(),
      id_operacion: null,
      id_usuario: 1, // Usuario actual del contexto
      entrada_salida: 1, // 1 para entrada
      codigo: `MOV${String(Date.now()).slice(-6)}`,
      fecha: new Date(stockEntry.fecha).toISOString(),
      habilitado: true
    };

    const movimientoDet = {
      id_det_movimiento: Date.now(),
      id_cab_movimiento: movimientoCab.id_movimiento_cab,
      id_producto: stockEntry.id_producto,
      cantidad: parseInt(stockEntry.cantidad),
      precio: parseFloat(stockEntry.precio),
      habilitado: true
    };

    console.log('Creando movimiento:', { movimientoCab, movimientoDet });

    // Resetear formulario
    setSelectedProduct(null);
    setStockEntry({
      id_producto: '',
      cantidad: '',
      precio: '',
      fecha: new Date().toISOString().split('T')[0],
      id_proveedor: '',
      notes: ''
    });

    alert('Stock agregado exitosamente');
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setStockEntry({
      id_producto: '',
      cantidad: '',
      precio: '',
      fecha: new Date().toISOString().split('T')[0],
      id_proveedor: '',
      notes: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
            Agregar Stock
          </h1>
          <p className="text-gray-600 mt-1">
            Registra la entrada de nuevos productos al inventario
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          {/* Product Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto *
            </label>
            {!selectedProduct ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowProductSelector(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">Seleccionar Producto</p>
                  <p className="text-sm text-gray-500">Haz clic para elegir un producto</p>
                </button>

                {/* Modal Selector Productos */}
                <ModalSelectorProductos
                  isOpen={showProductSelector}
                  onClose={() => setShowProductSelector(false)}
                  onSelect={handleProductSelect}
                  productos={availableProducts}
                />
              </div>
            ) : (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">{selectedProduct.descripcion}</p>
                      <p className="text-sm text-green-700">ID: {selectedProduct.id_producto} | Stock actual: {selectedProduct.stock} | Precio: S/. {selectedProduct.precio}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stock Entry Form */}
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad a Agregar *
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockEntry.cantidad}
                  onChange={(e) => handleInputChange('cantidad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: 50"
                />
              </div>

              {/* Proveedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  value={stockEntry.id_proveedor}
                  onChange={(e) => handleInputChange('id_proveedor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                      {proveedor.descripcion} - {proveedor.telefono}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio de Compra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de Compra (por unidad) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={stockEntry.precio}
                  onChange={(e) => handleInputChange('precio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: 2.50"
                />
              </div>

              {/* Fecha de Movimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Movimiento *
                </label>
                <input
                  type="date"
                  value={stockEntry.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>



              {/* Notas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  rows="3"
                  value={stockEntry.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Observaciones sobre este movimiento de stock..."
                />
              </div>
            </div>
          )}

          {/* Alert for required fields */}
          {selectedProduct && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Información importante</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Este movimiento se registrará en la tabla movimiento_det. Los campos marcados con (*) son obligatorios.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedProduct && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#3F7416' }}
              >
                <Save className="w-4 h-4 inline mr-2" />
                Guardar Entrada
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Stock Entries */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#3F7416' }}>
            Entradas Recientes
          </h3>
          <div className="space-y-3">
            {/* Ejemplo de entradas recientes */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Coca Cola 500ml</p>
                  <p className="text-sm text-gray-500">+30 unidades • Distribuidora Norte</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Hace 2 horas</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pan Integral</p>
                  <p className="text-sm text-gray-500">+20 unidades • Panadería Central</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Ayer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarStock;