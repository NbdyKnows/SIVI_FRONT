import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ModalEstablecerContrasenia, ModalOlvideContrasenia } from './modales';
import { useDatabase } from '../hooks/useDatabase';
import loginImage from '../assets/login.png';
import logo from '../assets/logo.png';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { updateUsuario } = useDatabase();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modales
  const [showPasswordSetupModal, setShowPasswordSetupModal] = useState(false);
  const [userRequiringPassword, setUserRequiringPassword] = useState(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = login(formData);
      
      if (result.success) {
        // Verificar si el usuario necesita establecer contraseña
        if (result.requiresPasswordSetup) {
          setUserRequiringPassword(result.user);
          setShowPasswordSetupModal(true);
          setIsLoading(false);
          return; // No navegar aún
        }
        
        // Navegar según el rol del usuario
        const userRole = result.user.role;
        if (userRole === 'cajero') {
          navigate('/app/ventas');
        } else if (userRole === 'inventario') {
          navigate('/app/productos');
        } else {
          navigate('/app/ventas'); // admin va a ventas por defecto
        }
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cuando el usuario establece su contraseña
  const handleEstablecerContrasenia = async (datosContrasenia) => {
    try {
      await updateUsuario(datosContrasenia.usuario, { 
        contrasenia: datosContrasenia.nuevaContrasenia,
        reset: false // Ya no necesita establecer contraseña
      });
      
      // Cerrar modal
      setShowPasswordSetupModal(false);
      setUserRequiringPassword(null);
      
      // Navegar según el rol del usuario
      const userRole = userRequiringPassword.role;
      if (userRole === 'cajero') {
        navigate('/app/ventas');
      } else if (userRole === 'inventario') {
        navigate('/app/productos');
      } else {
        navigate('/app/ventas'); // admin va a ventas por defecto
      }
      
    } catch (error) {
      console.error('Error al establecer contraseña:', error);
      setError('Error al establecer la contraseña. Intente nuevamente.');
    }
  };

  // Manejar recuperación de contraseña
  const handleRecuperarContrasenia = async (usuario) => {
    try {
      // Simular verificación y envío de notificación
      // Aquí podrías integrar con una API real
      console.log('Solicitud de recuperación enviada para:', usuario);
      return { success: true };
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      return { success: false, message: 'Error del servidor' };
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/3 bg-white flex items-center justify-center px-6 sm:px-8 lg:px-12 py-8 lg:py-8 animate-slide-in-left">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="flex justify-center mb-4">
                <img 
                  src={logo} 
                  alt="Minimarket Los Robles Logo" 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent px-2">Minimarket Los Robles</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* ID Input */}
            <div>
              <label htmlFor="id" className="block text-sm font-semibold mb-2 sm:mb-3 tracking-wide" style={{ color: '#633416' }}>
                Ingresa tu ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center">
                  <div className="text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold" style={{ backgroundColor: '#3F7416DB' }}>
                    <span>ID</span>
                  </div>
                </div>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="block w-full pl-3 sm:pl-4 pr-14 sm:pr-16 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                  style={{ 
                    color: '#633416'
                  }}
                  placeholder="Introduce tu identificación"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 sm:mb-3 tracking-wide" style={{ color: '#633416' }}>
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center space-x-1 sm:space-x-2">
                  <button
                    type="button"
                    className="hover:opacity-70 transition-opacity p-1"
                    style={{ color: '#633416' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                  <div className="text-white px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-lg" style={{ backgroundColor: '#3F7416DB' }}>
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-3 sm:pl-4 pr-18 sm:pr-20 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                  style={{ 
                    color: '#633416'
                  }}
                  placeholder="Introduce tu contraseña"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Demo Users Info */}
            <div className="text-xs sm:text-sm">
              <p className="font-semibold mb-1">Usuarios de prueba:</p>
              <div className="space-y-0.5">
                <p>Admin: USER001 / admin123</p>
                <p>Cajero: USER002 / cajero123</p>
                <p>Inventario: USER003 / inventario123</p>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mt-3 sm:mt-4">
              <button 
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs sm:text-sm hover:text-green-600 transition-colors duration-200 font-medium" 
                style={{ color: '#633416' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 mt-6 sm:mt-8 text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                background: 'linear-gradient(135deg, #3F7416 0%, #2F5A10 100%)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-tl from-green-50 to-blue-50 items-center justify-center relative overflow-hidden animate-slide-in-right">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40"></div>
        <img 
          src={loginImage} 
          alt="Login illustration" 
          className="max-w-full max-h-full object-contain relative z-10 drop-shadow-lg"
        />
      </div>

      {/* Modal para establecer contraseña */}
      <ModalEstablecerContrasenia
        isOpen={showPasswordSetupModal}
        onClose={() => {
          setShowPasswordSetupModal(false);
          setUserRequiringPassword(null);
        }}
        onSave={handleEstablecerContrasenia}
        usuario={userRequiringPassword}
      />

      {/* Modal para olvidé contraseña */}
      <ModalOlvideContrasenia
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onRecuperarContrasenia={handleRecuperarContrasenia}
      />
    </div>
  );
};

export default Login;