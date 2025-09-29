import React, { useState } from 'react';
import { X, Send, ArrowLeft, AlertCircle, CheckCircle, UserCheck, Key, Shield } from 'lucide-react';
import colors from '../../styles/colors';

const ModalOlvideContrasenia = ({ isOpen, onClose, onRecuperarContrasenia }) => {
  const [step, setStep] = useState(1); // 1: Solicitar usuario, 2: Confirmación enviada
  const [formData, setFormData] = useState({
    usuario: ''
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

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio';
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
      // Simular verificación de usuario
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await onRecuperarContrasenia(formData.usuario.trim());
      
      if (result.success) {
        setStep(2);
      } else {
        setErrors({ usuario: result.message || 'Usuario no encontrado' });
      }
      
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      setErrors({ usuario: 'Error al procesar la solicitud. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ usuario: '' });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFF8E1' }}>
              <Key className="w-5 h-5" style={{ color: colors.primary.brown }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: colors.primary.brown }}>
                {step === 1 ? 'Recuperar Contraseña' : 'Solicitud Enviada'}
              </h2>
              <p className="text-sm text-gray-600">
                {step === 1 ? 'Ingresa tu usuario para continuar' : 'Revisa tu correo electrónico'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {step === 1 ? (
            /* Paso 1: Solicitar usuario */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Información de seguridad */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFE082' }}>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 mt-0.5 mr-2" style={{ color: colors.primary.brown }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#BF8F00' }}>Seguridad</p>
                    <p className="text-sm mt-1" style={{ color: colors.primary.brown }}>
                      Te enviaremos un enlace seguro para restablecer tu contraseña. 
                      Solo personal autorizado puede gestionar las cuentas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Campo usuario */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  Nombre de Usuario *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => handleInputChange('usuario', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.usuario ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': colors.primary.green }}
                    placeholder="Ingresa tu nombre de usuario"
                    disabled={isLoading}
                  />
                </div>
                {errors.usuario && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.usuario}
                  </p>
                )}
              </div>

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={isLoading || !formData.usuario.trim()}
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
                    Verificando usuario...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Solicitar Recuperación
                  </>
                )}
              </button>

              {/* Enlace para volver */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          ) : (
            /* Paso 2: Confirmación enviada */
            <div className="text-center space-y-4">
              {/* Ícono de éxito */}
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: '#F0F8E8' }}>
                <CheckCircle className="w-8 h-8" style={{ color: colors.primary.green }} />
              </div>

              {/* Mensaje principal */}
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary.brown }}>
                  Solicitud Enviada
                </h3>
                <p className="text-gray-600 text-sm">
                  Se ha notificado al administrador del sistema sobre tu solicitud de 
                  recuperación de contraseña para el usuario <strong>{formData.usuario}</strong>.
                </p>
              </div>

              {/* Información adicional */}
              <div className="p-4 rounded-lg text-left" style={{ backgroundColor: '#F0F8E8', border: '1px solid #D1E7C4' }}>
                <p className="text-sm font-medium mb-2" style={{ color: '#2F5A0F' }}>Próximos pasos:</p>
                <ul className="text-sm space-y-1" style={{ color: colors.primary.brown }}>
                  <li>• El administrador revisará tu solicitud</li>
                  <li>• Recibirás un enlace seguro por correo electrónico</li>
                  <li>• Podrás establecer una nueva contraseña</li>
                  <li>• El proceso puede tomar de 1 a 24 horas</li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="space-y-2">
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 text-white rounded-lg transition-all duration-200"
                  style={{ backgroundColor: colors.primary.green }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.states.hover}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary.green}
                >
                  Entendido
                </button>
                
                <button
                  onClick={handleBackToStep1}
                  className="w-full px-6 py-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Hacer otra solicitud
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalOlvideContrasenia;