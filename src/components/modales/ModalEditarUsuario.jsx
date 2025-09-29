import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, User, Shield, Eye, EyeOff } from 'lucide-react';
import colors from '../../styles/colors';

const ModalEditarUsuario = ({ isOpen, onClose, onSave, usuario, roles }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    id_rol: '',
    habilitado: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Llenar formulario cuando se abre el modal
  useEffect(() => {
    if (usuario && isOpen) {
      setFormData({
        nombre: usuario.nombre || '',
        usuario: usuario.usuario || '',
        id_rol: usuario.id_rol || '',
        habilitado: usuario.habilitado !== undefined ? usuario.habilitado : true
      });
      setErrors({});
    }
  }, [usuario, isOpen]);

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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio';
    } else if (formData.usuario.trim().length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario.trim())) {
      newErrors.usuario = 'Solo se permiten letras, números y guiones bajos';
    }

    if (!formData.id_rol) {
      newErrors.id_rol = 'Debe seleccionar un rol';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave({
        id_usuario: usuario.id_usuario,
        ...formData,
        // Mantener datos que no se editan
        contrasenia: usuario.contrasenia,
        fecha_registro: usuario.fecha_registro,
        reset: usuario.reset
      });
      
      handleClose();
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      usuario: '',
      id_rol: '',
      habilitado: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
              <User className="w-5 h-5" style={{ color: colors.primary.brown }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: colors.primary.brown }}>
                Editar Usuario
              </h2>
              <p className="text-sm text-gray-600">Modificar información del usuario</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Información del usuario actual */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3E5F5', border: '1px solid #E1BEE7' }}>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium text-sm">
                  {usuario.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#7B1FA2' }}>
                  {usuario.codigo} - {usuario.nombre}
                </p>
                <p className="text-xs text-gray-600">
                  Registro: {new Date(usuario.fecha_registro).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': colors.primary.green }}
              placeholder="Ej: Juan Pérez García"
              disabled={isLoading}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Nombre de Usuario *
            </label>
            <input
              type="text"
              value={formData.usuario}
              onChange={(e) => handleInputChange('usuario', e.target.value.toLowerCase())}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.usuario ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': colors.primary.green }}
              placeholder="ej: jperez"
              disabled={isLoading}
            />
            {errors.usuario && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.usuario}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Solo letras, números y guiones bajos. Se convertirá a minúsculas.
            </p>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Rol del Usuario *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={formData.id_rol}
                onChange={(e) => handleInputChange('id_rol', parseInt(e.target.value))}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.id_rol ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': colors.primary.green }}
                disabled={isLoading}
              >
                <option value="">Seleccionar rol...</option>
                {roles?.map(rol => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.descripcion === 'admin' ? 'Administrador' :
                     rol.descripcion === 'cajero' ? 'Cajero' :
                     rol.descripcion === 'inventario' ? 'Inventario' :
                     rol.descripcion}
                  </option>
                ))}
              </select>
            </div>
            {errors.id_rol && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.id_rol}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Estado del Usuario
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="habilitado"
                  checked={formData.habilitado === true}
                  onChange={() => handleInputChange('habilitado', true)}
                  className="mr-2"
                  style={{ accentColor: colors.primary.green }}
                  disabled={isLoading}
                />
                <span className="text-sm text-green-700">Activo</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="habilitado"
                  checked={formData.habilitado === false}
                  onChange={() => handleInputChange('habilitado', false)}
                  className="mr-2"
                  style={{ accentColor: colors.primary.green }}
                  disabled={isLoading}
                />
                <span className="text-sm text-red-700">Inactivo</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Los usuarios inactivos no podrán iniciar sesión en el sistema.
            </p>
          </div>

          {/* Información de contraseña */}
          {usuario.reset && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF3E0', border: '1px solid #FFE0B2' }}>
              <p className="text-sm font-medium" style={{ color: '#E65100' }}>
                Contraseña Pendiente
              </p>
              <p className="text-xs mt-1" style={{ color: '#BF360C' }}>
                Este usuario debe establecer su contraseña en el próximo inicio de sesión.
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: colors.primary.green }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = colors.states.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = colors.primary.green;
                }
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;