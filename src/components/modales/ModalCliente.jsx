import React, { useState, useEffect } from 'react';
import { X, User, AlertCircle } from 'lucide-react';

const ModalCliente = ({ isOpen, onClose, onSave, clienteActual = '' }) => {
  const [tempDNI, setTempDNI] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTempDNI(clienteActual);
      setError('');
    }
  }, [isOpen, clienteActual]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    setTempDNI(value);
    setError('');
  };

  const handleSave = () => {
    // Validar DNI si se ingresó
    if (tempDNI && tempDNI.length !== 8) {
      setError('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    onSave(tempDNI);
  };

  const handleClose = () => {
    setTempDNI('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
              Información del Cliente
            </h2>
            <p className="text-sm mt-1" style={{ color: '#666666' }}>
              Campo opcional para registrar el DNI del cliente
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              <User className="w-4 h-4 inline mr-2" />
              DNI del Cliente
            </label>
            <input
              type="text"
              value={tempDNI}
              onChange={handleInputChange}
              placeholder="Ingrese el DNI (opcional)"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': '#3F7416' }}
              maxLength={8}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            {tempDNI && tempDNI.length < 8 && !error && (
              <p className="text-gray-500 text-xs mt-1">
                {tempDNI.length}/8 dígitos ingresados
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg font-medium transition-colors hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#3F7416' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2F5A10'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416'}
            >
              {tempDNI ? 'Guardar Cliente' : 'Continuar Sin DNI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCliente;