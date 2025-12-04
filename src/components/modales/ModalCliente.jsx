import React, { useState, useEffect } from 'react';
import { X, User, AlertCircle, Search, Loader2, CheckCircle } from 'lucide-react';
import clientesService from '../../services/clientesService';

const ModalCliente = ({ isOpen, onClose, onSave, clienteActual = '' }) => {
  const [tempDNI, setTempDNI] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [esNuevoCliente, setEsNuevoCliente] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempDNI(clienteActual);
      setError('');
      setClienteEncontrado(null);
      setEsNuevoCliente(false);
    }
  }, [isOpen, clienteActual]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    setTempDNI(value);
    setError('');
    setClienteEncontrado(null);
    setEsNuevoCliente(false);
  };

  const handleBuscarCliente = async () => {
    // Validar DNI
    if (!tempDNI || tempDNI.length !== 8) {
      setError('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    setIsSearching(true);
    setError('');
    setClienteEncontrado(null);
    setEsNuevoCliente(false);

    try {
      // 1. Primero buscar en la BD
      const clienteExistente = await clientesService.getByDni(tempDNI);
      
      if (clienteExistente) {
        // Cliente encontrado en BD
        setClienteEncontrado(clienteExistente);
        setEsNuevoCliente(false);
      } else {
        // 2. No existe en BD, consultar RENIEC
        const datosReniecResult = await clientesService.consultarReniec(tempDNI);
        
        if (datosReniecResult.success) {
          // Guardar datos de RENIEC para mostrar
          setClienteEncontrado({
            dni: tempDNI,
            nombres: datosReniecResult.nombre
          });
          setEsNuevoCliente(true);
        } else {
          setError(datosReniecResult.message || 'No se encontró información del DNI en RENIEC');
        }
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setError('Error al buscar el cliente. Intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!clienteEncontrado) {
      setError('Debe buscar un cliente primero');
      return;
    }

    try {
      if (esNuevoCliente) {
        // Registrar el nuevo cliente en la BD
        setIsSearching(true);
        const nuevoCliente = await clientesService.create({
          dni: tempDNI,
          nombres: clienteEncontrado.nombres
        });
        
        // Enviar el cliente recién creado
        onSave(nuevoCliente);
      } else {
        // Cliente ya existía, solo enviarlo
        onSave(clienteEncontrado);
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setError('Error al registrar el cliente. Intente nuevamente.');
      setIsSearching(false);
    }
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
              Buscar Cliente
            </h2>
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
            <div className="flex gap-2">
              <input
                type="text"
                value={tempDNI}
                onChange={handleInputChange}
                placeholder="Ingrese el DNI"
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': '#3F7416' }}
                maxLength={8}
                autoFocus
                disabled={isSearching}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tempDNI.length === 8) {
                    handleBuscarCliente();
                  }
                }}
              />
              <button
                onClick={handleBuscarCliente}
                disabled={isSearching || tempDNI.length !== 8}
                className="px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: '#3F7416' }}
                onMouseEnter={(e) => !isSearching && (e.target.style.backgroundColor = '#2F5A10')}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416'}
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
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

          {/* Información del cliente encontrado */}
          {clienteEncontrado && (
            <div className={`mb-6 p-4 border rounded-lg animate-fade-in ${
              esNuevoCliente 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  esNuevoCliente ? 'text-blue-600' : 'text-green-600'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    esNuevoCliente ? 'text-blue-800' : 'text-green-800'
                  }`}>
                    {esNuevoCliente ? 'Nuevo Cliente' : 'Cliente'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">DNI:</span> {clienteEncontrado.dni}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Nombre:</span> {clienteEncontrado.nombres || clienteEncontrado.nombre}
                    </p>
                    {clienteEncontrado.telefono && (
                      <p className="text-gray-700">
                        <span className="font-medium">Teléfono:</span> {clienteEncontrado.telefono}
                      </p>
                    )}
                    {clienteEncontrado.email && (
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {clienteEncontrado.email}
                      </p>
                    )}
                  </div>
                  {esNuevoCliente && (
                    <p className="text-xs text-blue-700 mt-2 italic">
                      Este cliente será registrado al hacer clic en "Usar Cliente"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
              disabled={!clienteEncontrado}
              className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#3F7416' }}
              onMouseEnter={(e) => clienteEncontrado && (e.target.style.backgroundColor = '#2F5A10')}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3F7416'}
            >
              Usar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCliente;