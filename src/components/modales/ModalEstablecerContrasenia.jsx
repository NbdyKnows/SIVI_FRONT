import React, { useState } from 'react';
import { X, Save, AlertCircle, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import colors from '../../styles/colors';

const ModalEstablecerContrasenia = ({ isOpen, onClose, onSave, usuario }) => {
  const [formData, setFormData] = useState({
    nuevaContrasenia: '',
    confirmarContrasenia: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones en tiempo real
  const passwordValidation = {
    length: formData.nuevaContrasenia.length >= 8,
    uppercase: /[A-Z]/.test(formData.nuevaContrasenia),
    lowercase: /[a-z]/.test(formData.nuevaContrasenia),
    number: /\d/.test(formData.nuevaContrasenia),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.nuevaContrasenia)
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

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

    if (!formData.nuevaContrasenia) {
      newErrors.nuevaContrasenia = 'La contraseña es obligatoria';
    } else if (!isPasswordValid) {
      newErrors.nuevaContrasenia = 'La contraseña no cumple con los requisitos';
    }

    if (!formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = 'Debe confirmar la contraseña';
    } else if (formData.nuevaContrasenia !== formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = 'Las contraseñas no coinciden';
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
        usuario: usuario.usuario,
        nuevaContrasenia: formData.nuevaContrasenia
      });
      
      handleClose();
      
    } catch (error) {
      console.error('Error al establecer contraseña:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nuevaContrasenia: '',
      confirmarContrasenia: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen || !usuario) return null;

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center space-x-2 text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      {isValid ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F0F8E8' }}>
              <Lock className="w-5 h-5" style={{ color: colors.primary.brown }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: colors.primary.brown }}>
                Establecer Contraseña
              </h2>
              <p className="text-sm text-gray-600">Bienvenido, {usuario.nombre}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mensaje de bienvenida */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F8E8', border: '1px solid #D1E7C4' }}>
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mt-0.5 mr-2" style={{ color: colors.primary.brown }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#2F5A0F' }}>Primer Inicio de Sesión</p>
                <p className="text-sm mt-1" style={{ color: colors.primary.brown }}>
                  Para garantizar tu seguridad, debes establecer tu propia contraseña. 
                  Esta será única y personal para ti.
                </p>
              </div>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.nuevaContrasenia}
                onChange={(e) => handleInputChange('nuevaContrasenia', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.nuevaContrasenia ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': colors.primary.green }}
                placeholder="Crea tu contraseña segura"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.nuevaContrasenia && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.nuevaContrasenia}
              </p>
            )}
            
            {/* Validaciones en tiempo real */}
            <div className="mt-2 space-y-1">
              <ValidationItem isValid={passwordValidation.length} text="Al menos 8 caracteres" />
              <ValidationItem isValid={passwordValidation.uppercase} text="Una letra mayúscula" />
              <ValidationItem isValid={passwordValidation.lowercase} text="Una letra minúscula" />
              <ValidationItem isValid={passwordValidation.number} text="Un número" />
              <ValidationItem isValid={passwordValidation.special} text="Un carácter especial (!@#$%^&*)" />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmarContrasenia}
                onChange={(e) => handleInputChange('confirmarContrasenia', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.confirmarContrasenia ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': colors.primary.green }}
                placeholder="Confirma tu contraseña"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmarContrasenia && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmarContrasenia}
              </p>
            )}
            {formData.confirmarContrasenia && formData.nuevaContrasenia === formData.confirmarContrasenia && (
              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || formData.nuevaContrasenia !== formData.confirmarContrasenia}
              className="w-full px-6 py-3 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Estableciendo contraseña...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Establecer Contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEstablecerContrasenia;