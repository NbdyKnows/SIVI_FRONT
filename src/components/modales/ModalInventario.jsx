import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Package } from 'lucide-react';

const ModalInventario = ({ isOpen, onClose, onSave, product = null, categorias = [] }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    id_cat: '',
    precio: '',
    stock: '',
    fecha: new Date().toISOString().split('T')[0],
    habilitado: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para cargar datos del producto si está editando
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Modo edición
        setFormData({
          descripcion: product.name || '',
          id_cat: product.id_cat?.toString() || '',
          precio: product.price?.toString() || '',
          stock: product.currentStock?.toString() || '',
          fecha: product.lastUpdated || new Date().toISOString().split('T')[0],
          habilitado: product.habilitado !== undefined ? product.habilitado : true
        });
      } else {
        // Modo creación
        setFormData({
          descripcion: '',
          id_cat: '',
          precio: '',
          stock: '',
          fecha: new Date().toISOString().split('T')[0],
          habilitado: true
        });
      }
      setErrors({});
    }
  }, [isOpen, product]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'El nombre del producto es obligatorio';
    } else if (formData.descripcion.length < 3) {
      newErrors.descripcion = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.id_cat) {
      newErrors.id_cat = 'La categoría es obligatoria';
    }

    if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const categoria = categorias.find(cat => cat.id_cat === parseInt(formData.id_cat));
      
      const productData = {
        ...(product && { id: product.id }),
        name: formData.descripcion.trim(),
        id_cat: parseInt(formData.id_cat),
        category: categoria?.descripcion || 'Sin categoría',
        price: parseFloat(formData.precio),
        currentStock: parseInt(formData.stock),
        lastUpdated: formData.fecha,
        habilitado: formData.habilitado
      };

      // Si es nuevo producto, agregar datos adicionales
      if (!product) {
        productData.id = Date.now();
        productData.sku = `P${String(Date.now()).slice(-3)}`;
        productData.minStock = 10;
        productData.maxStock = 100;
        productData.supplier = 'Proveedor General';
        productData.status = parseInt(formData.stock) <= 20 ? 'low' : 'normal';
      }

      onSave(productData);
      
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      descripcion: '',
      id_cat: '',
      precio: '',
      stock: '',
      fecha: new Date().toISOString().split('T')[0],
      habilitado: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = Boolean(product);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F0F8E8' }}>
              <Package className="w-5 h-5" style={{ color: '#3F7416' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
              {isEditing ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre del Producto */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              placeholder="Ej: Coca Cola 500ml"
              maxLength={100}
              disabled={isLoading}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Categoría *
            </label>
            <select
              value={formData.id_cat}
              onChange={(e) => handleInputChange('id_cat', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.id_cat ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              disabled={isLoading}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(categoria => (
                <option key={categoria.id_cat} value={categoria.id_cat}>
                  {categoria.descripcion}
                </option>
              ))}
            </select>
            {errors.id_cat && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.id_cat}
              </p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Precio (S/) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={(e) => handleInputChange('precio', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.precio ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.precio && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.precio}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              {isEditing ? 'Stock Actual' : 'Stock Inicial'} *
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              placeholder="0"
              disabled={isLoading}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.stock}
              </p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Fecha de Registro *
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.fecha ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              disabled={isLoading}
            />
            {errors.fecha && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.fecha}
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="habilitado"
              checked={formData.habilitado}
              onChange={(e) => handleInputChange('habilitado', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-1"
              style={{ 
                accentColor: '#3F7416',
                '--tw-ring-color': '#3F7416' 
              }}
              disabled={isLoading}
            />
            <label htmlFor="habilitado" className="text-sm" style={{ color: '#666666' }}>
              Producto habilitado
            </label>
          </div>

          {/* Información */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F8E8', border: '1px solid #D1E7C4' }}>
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mt-0.5 mr-2" style={{ color: '#3F7416' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#2F5A0F' }}>Información</p>
                <p className="text-sm mt-1" style={{ color: '#3F7416' }}>
                  Todos los campos marcados con (*) son obligatorios.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: '#3F7416' }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#2F5A10';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#3F7416';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInventario;