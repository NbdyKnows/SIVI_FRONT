import React, { useState, useEffect } from 'react';
import { X, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const ModalProveedor = ({ isOpen, onClose, onSave, proveedor = null }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    telefono: '',
    habilitado: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para cargar datos del proveedor si está editando
  useEffect(() => {
    if (isOpen) {
      if (proveedor) {
        // Modo edición
        setFormData({
          descripcion: proveedor.descripcion || '',
          telefono: proveedor.telefono || '',
          habilitado: proveedor.habilitado !== undefined ? proveedor.habilitado : true
        });
      } else {
        // Modo creación
        setFormData({
          descripcion: '',
          telefono: '',
          habilitado: true
        });
      }
      setErrors({});
    }
  }, [isOpen, proveedor]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'El nombre del proveedor es obligatorio';
    } else if (formData.descripcion.length < 3) {
      newErrors.descripcion = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{9}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos';
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
      
      const proveedorData = {
        ...(proveedor && { id_proveedor: proveedor.id_proveedor }),
        descripcion: formData.descripcion.trim(),
        telefono: formData.telefono.trim(),
        habilitado: formData.habilitado
      };

      // Si es nuevo proveedor, agregar ID temporal
      if (!proveedor) {
        proveedorData.id_proveedor = Date.now();
      }

      onSave(proveedorData);
      
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      descripcion: '',
      telefono: '',
      habilitado: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = Boolean(proveedor);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
            {isEditing ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre del Proveedor */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              <User className="w-4 h-4 inline mr-2" />
              Nombre del Proveedor *
            </label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              placeholder="Ej: Distribuidora Los Andes"
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

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              <Phone className="w-4 h-4 inline mr-2" />
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.telefono ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              placeholder="987654321"
              maxLength={12}
              disabled={isLoading}
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="habilitado"
              id="habilitado"
              checked={formData.habilitado}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 focus:ring-1"
              style={{ 
                accentColor: '#3F7416',
                '--tw-ring-color': '#3F7416' 
              }}
              disabled={isLoading}
            />
            <label htmlFor="habilitado" className="text-sm flex items-center gap-2" style={{ color: '#666666' }}>
              <CheckCircle className="w-4 h-4" style={{ color: formData.habilitado ? '#3F7416' : '#CCCCCC' }} />
              Proveedor activo
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  {isEditing ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProveedor;