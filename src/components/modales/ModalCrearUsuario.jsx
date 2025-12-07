import React, { useState } from 'react';
import { X, Save, AlertCircle, UserPlus, User, Shield } from 'lucide-react';
import { useDatabase } from '../../hooks/useDatabase';
import colors from '../../styles/colors';

const ModalCrearUsuario = ({ isOpen, onClose, onSave }) => {
  const { data } = useDatabase();
  const roles = data.rol;

  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    id_rol: '',
    habilitado: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.usuario = 'El usuario solo puede contener letras, números y guiones bajos';
    } else {
      // Verificar si el usuario ya existe
      const usuarioExistente = data.usuario.find(u => 
        u.usuario.toLowerCase() === formData.usuario.trim().toLowerCase()
      );
      if (usuarioExistente) {
        newErrors.usuario = 'Este nombre de usuario ya existe';
      }
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Enviar solo los campos requeridos por el backend
      const newUser = {
        usuario: formData.usuario.trim(),
        nombre: formData.nombre.trim(),
        idRol: parseInt(formData.id_rol)
      };

      onSave(newUser);
      handleClose();
      
    } catch (error) {
      console.error('Error al crear usuario:', error);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F0F8E8' }}>
              <UserPlus className="w-5 h-5" style={{ color: colors.primary.brown }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: colors.primary.brown }}>
              Crear Nuevo Usuario
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
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              <User className="w-4 h-4 inline mr-2" />
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
              placeholder="Ej: Juan Carlos Pérez"
              maxLength={100}
              disabled={isLoading}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Nombre de Usuario */}
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
              placeholder="Ej: jperez"
              maxLength={50}
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
              <Shield className="w-4 h-4 inline mr-2" />
              Rol *
            </label>
            <select
              value={formData.id_rol}
              onChange={(e) => handleInputChange('id_rol', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                errors.id_rol ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': colors.primary.green }}
              disabled={isLoading}
            >
              <option value="">Seleccionar rol</option>
              {roles.map(rol => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.descripcion === 'admin' ? 'Administrador' :
                   rol.descripcion === 'cajero' ? 'Cajero' :
                   rol.descripcion === 'inventario' ? 'Inventario' :
                   rol.descripcion}
                </option>
              ))}
            </select>
            {errors.id_rol && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.id_rol}
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
                accentColor: colors.primary.green,
                '--tw-ring-color': colors.primary.green 
              }}
              disabled={isLoading}
            />
            <label htmlFor="habilitado" className="text-sm" style={{ color: '#666666' }}>
              Usuario habilitado
            </label>
          </div>

          {/* Información sobre contraseña */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F8E8', border: '1px solid #D1E7C4' }}>
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mt-0.5 mr-2" style={{ color: colors.primary.brown }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#2F5A0F' }}>Información de Seguridad</p>
                <p className="text-sm mt-1" style={{ color: colors.primary.brown }}>
                  El usuario deberá crear su propia contraseña en el primer inicio de sesión. 
                  Esto garantiza la privacidad y seguridad del sistema.
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
                  Creando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Crear Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearUsuario;