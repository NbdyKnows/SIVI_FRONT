import React, { useState, useEffect } from 'react';
import { X, Percent, Tag, Calendar, Search, Package, Grid, AlertCircle, CheckCircle } from 'lucide-react';

const ModalDescuento = ({ isOpen, onClose, onSave, descuento = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo_aplicacion: 'producto', // 'producto' o 'categoria'
    tipo_descuento: 'porcentaje', // 'porcentaje' o 'monto_fijo'
    valor: '',
    fecha_inicio: '',
    fecha_fin: '',
    productos_seleccionados: [],
    categorias_seleccionadas: [],
    activo: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para productos y categorías
  const productosDisponibles = [
    { id: 1, nombre: 'Coca Cola 500ml', categoria: 'Bebidas', precio: 3.50 },
    { id: 2, nombre: 'Galletas Oreo', categoria: 'Snacks', precio: 4.20 },
    { id: 3, nombre: 'Leche Gloria 1L', categoria: 'Lácteos', precio: 4.80 },
    { id: 4, nombre: 'Detergente Ariel', categoria: 'Limpieza', precio: 12.90 },
    { id: 5, nombre: 'Pan Bimbo', categoria: 'Panadería', precio: 3.20 },
    { id: 6, nombre: 'Yogurt Gloria', categoria: 'Lácteos', precio: 2.50 },
    { id: 7, nombre: 'Papas Lays', categoria: 'Snacks', precio: 3.80 },
    { id: 8, nombre: 'Agua San Luis', categoria: 'Bebidas', precio: 1.50 }
  ];

  const categoriasDisponibles = [
    { id: 'bebidas', nombre: 'Bebidas', productos_count: 15 },
    { id: 'snacks', nombre: 'Snacks', productos_count: 23 },
    { id: 'lacteos', nombre: 'Lácteos', productos_count: 12 },
    { id: 'limpieza', nombre: 'Limpieza', productos_count: 18 },
    { id: 'panaderia', nombre: 'Panadería', productos_count: 8 }
  ];

  // Efecto para cargar datos del descuento si está editando
  useEffect(() => {
    if (isOpen) {
      if (descuento) {
        setFormData({
          nombre: descuento.nombre || '',
          descripcion: descuento.descripcion || '',
          tipo_aplicacion: descuento.tipo_aplicacion || 'producto',
          tipo_descuento: descuento.tipo_descuento || 'porcentaje',
          valor: descuento.valor || '',
          fecha_inicio: descuento.fecha_inicio || '',
          fecha_fin: descuento.fecha_fin || '',
          productos_seleccionados: descuento.productos_seleccionados || [],
          categorias_seleccionadas: descuento.categorias_seleccionadas || [],
          activo: descuento.activo !== undefined ? descuento.activo : true
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          tipo_aplicacion: 'producto',
          tipo_descuento: 'porcentaje',
          valor: '',
          fecha_inicio: '',
          fecha_fin: '',
          productos_seleccionados: [],
          categorias_seleccionadas: [],
          activo: true
        });
      }
      setErrors({});
      setSearchTerm('');
    }
  }, [isOpen, descuento]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProductoToggle = (producto) => {
    setFormData(prev => {
      const isSelected = prev.productos_seleccionados.some(p => p.id === producto.id);
      return {
        ...prev,
        productos_seleccionados: isSelected
          ? prev.productos_seleccionados.filter(p => p.id !== producto.id)
          : [...prev.productos_seleccionados, producto]
      };
    });
  };

  const handleCategoriaToggle = (categoria) => {
    setFormData(prev => {
      const isSelected = prev.categorias_seleccionadas.some(c => c.id === categoria.id);
      return {
        ...prev,
        categorias_seleccionadas: isSelected
          ? prev.categorias_seleccionadas.filter(c => c.id !== categoria.id)
          : [...prev.categorias_seleccionadas, categoria]
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del descuento es obligatorio';
    }

    if (!formData.valor || isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'El valor debe ser un número mayor a 0';
    }

    if (formData.tipo_descuento === 'porcentaje' && parseFloat(formData.valor) > 100) {
      newErrors.valor = 'El porcentaje no puede ser mayor a 100%';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es obligatoria';
    }

    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio >= formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (formData.tipo_aplicacion === 'producto' && formData.productos_seleccionados.length === 0) {
      newErrors.seleccion = 'Debe seleccionar al menos un producto';
    }

    if (formData.tipo_aplicacion === 'categoria' && formData.categorias_seleccionadas.length === 0) {
      newErrors.seleccion = 'Debe seleccionar al menos una categoría';
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const descuentoData = {
        ...(descuento && { id: descuento.id }),
        ...formData,
        id: descuento?.id || Date.now(),
        fecha_creacion: descuento?.fecha_creacion || new Date().toISOString()
      };

      onSave(descuentoData);
      
    } catch (error) {
      console.error('Error al guardar descuento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tipo_aplicacion: 'producto',
      tipo_descuento: 'porcentaje',
      valor: '',
      fecha_inicio: '',
      fecha_fin: '',
      productos_seleccionados: [],
      categorias_seleccionadas: [],
      activo: true
    });
    setErrors({});
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = Boolean(descuento);

  // Filtrar productos para búsqueda
  const productosFiltrados = productosDisponibles.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar categorías para búsqueda
  const categoriasFiltradas = categoriasDisponibles.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
            {isEditing ? 'Editar Descuento' : 'Crear Nuevo Descuento'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium" style={{ color: '#3F7416' }}>
                Información Básica
              </h3>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  <Tag className="w-4 h-4 inline mr-2" />
                  Nombre del Descuento *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  style={{ '--tw-ring-color': '#3F7416' }}
                  placeholder="Ej: Descuento Navideño"
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1"
                  style={{ '--tw-ring-color': '#3F7416' }}
                  placeholder="Descripción opcional del descuento"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* Tipo de Aplicación */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  Aplicar Descuento a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="tipo_aplicacion"
                      value="producto"
                      checked={formData.tipo_aplicacion === 'producto'}
                      onChange={handleInputChange}
                      className="text-green-600"
                      disabled={isLoading}
                    />
                    <Package className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">Productos Específicos</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="tipo_aplicacion"
                      value="categoria"
                      checked={formData.tipo_aplicacion === 'categoria'}
                      onChange={handleInputChange}
                      className="text-green-600"
                      disabled={isLoading}
                    />
                    <Grid className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">Categorías</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Configuración del Descuento */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium" style={{ color: '#3F7416' }}>
                Configuración del Descuento
              </h3>

              {/* Tipo de Descuento */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  <Percent className="w-4 h-4 inline mr-2" />
                  Tipo de Descuento
                </label>
                <select
                  name="tipo_descuento"
                  value={formData.tipo_descuento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1"
                  style={{ '--tw-ring-color': '#3F7416' }}
                  disabled={isLoading}
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="monto_fijo">Monto Fijo (S/)</option>
                </select>
              </div>

              {/* Valor del Descuento */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  Valor del Descuento *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.valor ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': '#3F7416' }}
                    placeholder={formData.tipo_descuento === 'porcentaje' ? '10' : '5.00'}
                    step={formData.tipo_descuento === 'porcentaje' ? '1' : '0.01'}
                    min="0"
                    max={formData.tipo_descuento === 'porcentaje' ? '100' : undefined}
                    disabled={isLoading}
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">
                    {formData.tipo_descuento === 'porcentaje' ? '%' : 'S/'}
                  </span>
                </div>
                {errors.valor && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.valor}
                  </p>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.fecha_inicio ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': '#3F7416' }}
                    disabled={isLoading}
                  />
                  {errors.fecha_inicio && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fecha_inicio}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                    Fecha Fin *
                  </label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.fecha_fin ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': '#3F7416' }}
                    disabled={isLoading}
                  />
                  {errors.fecha_fin && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fecha_fin}
                    </p>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="activo"
                  id="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 focus:ring-1"
                  style={{ 
                    accentColor: '#3F7416',
                    '--tw-ring-color': '#3F7416' 
                  }}
                  disabled={isLoading}
                />
                <label htmlFor="activo" className="text-sm flex items-center gap-2" style={{ color: '#666666' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: formData.activo ? '#3F7416' : '#CCCCCC' }} />
                  Descuento activo
                </label>
              </div>
            </div>
          </div>

          {/* Selección de Productos/Categorías */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: '#3F7416' }}>
              {formData.tipo_aplicacion === 'producto' ? 'Seleccionar Productos' : 'Seleccionar Categorías'}
            </h3>

            {/* Buscador */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': '#3F7416' }}
                placeholder={`Buscar ${formData.tipo_aplicacion === 'producto' ? 'productos' : 'categorías'}...`}
                disabled={isLoading}
              />
            </div>

            {/* Lista de selección */}
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              {formData.tipo_aplicacion === 'producto' ? (
                // Lista de productos
                <div className="divide-y divide-gray-200">
                  {productosFiltrados.map((producto) => {
                    const isSelected = formData.productos_seleccionados.some(p => p.id === producto.id);
                    return (
                      <label
                        key={producto.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleProductoToggle(producto)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: '#3F7416' }}
                          disabled={isLoading}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                          <div className="text-xs text-gray-500">{producto.categoria} - S/ {producto.precio}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Lista de categorías
                <div className="divide-y divide-gray-200">
                  {categoriasFiltradas.map((categoria) => {
                    const isSelected = formData.categorias_seleccionadas.some(c => c.id === categoria.id);
                    return (
                      <label
                        key={categoria.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCategoriaToggle(categoria)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: '#3F7416' }}
                          disabled={isLoading}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{categoria.nombre}</div>
                          <div className="text-xs text-gray-500">{categoria.productos_count} productos</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {errors.seleccion && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.seleccion}
              </p>
            )}

            {/* Resumen de selección */}
            <div className="mt-3 text-sm text-gray-600">
              {formData.tipo_aplicacion === 'producto' ? (
                <span>{formData.productos_seleccionados.length} productos seleccionados</span>
              ) : (
                <span>{formData.categorias_seleccionadas.length} categorías seleccionadas</span>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                  <Percent className="w-4 h-4" />
                  {isEditing ? 'Actualizar Descuento' : 'Crear Descuento'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDescuento;