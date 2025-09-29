import React, { useState } from 'react';
import { Users, UserPlus, Shield, UserCheck, Edit, Trash2, Key, RotateCcw } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { ModalCrearUsuario, ModalEditarUsuario, ModalEstablecerContrasenia, ModalOlvideContrasenia } from '../components/modales';

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  
  // Estados para modales
  const [modalCrearUsuario, setModalCrearUsuario] = useState(false);
  const [modalEditarUsuario, setModalEditarUsuario] = useState(false);
  const [modalEstablecerContrasenia, setModalEstablecerContrasenia] = useState(false);
  const [modalOlvideContrasenia, setModalOlvideContrasenia] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  
  const { getUsuariosWithRol, createUsuario, updateUsuario, data } = useDatabase();

  // Obtener usuarios con datos de rol usando la función del hook
  const usuariosConRol = getUsuariosWithRol().map(usuario => ({
    ...usuario,
    codigo: `USER${String(usuario.id_usuario).padStart(3, '0')}`
  }));

  // Filtrar usuarios
  const usuariosFiltrados = usuariosConRol.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || usuario.rol_descripcion === roleFilter;
    
    return matchesSearch && matchesRole && usuario.habilitado;
  });

  // Estadísticas
  const totalUsuarios = usuariosConRol.length;
  const usuariosActivos = usuariosConRol.filter(u => u.habilitado).length;
  const administradores = usuariosConRol.filter(u => u.rol_descripcion === 'admin').length;

  // Funciones para manejar modales
  const handleCrearUsuario = async (datosUsuario) => {
    try {
      const nuevoUsuario = await createUsuario(datosUsuario);
      console.log('Usuario creado:', nuevoUsuario);
      // Aquí podrías actualizar el estado o recargar la lista
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const handleEstablecerContrasenia = async (datosContrasenia) => {
    try {
      await updateUsuario(datosContrasenia.usuario, { 
        contrasenia: datosContrasenia.nuevaContrasenia,
        reset: false // Ya no necesita establecer contraseña
      });
      console.log('Contraseña establecida para:', datosContrasenia.usuario);
    } catch (error) {
      console.error('Error al establecer contraseña:', error);
    }
  };

  const handleRecuperarContrasenia = async (usuario) => {
    try {
      // Simular verificación y envío de notificación
      const usuarioEncontrado = usuariosConRol.find(u => u.usuario === usuario);
      if (usuarioEncontrado) {
        console.log('Solicitud de recuperación enviada para:', usuario);
        return { success: true };
      } else {
        return { success: false, message: 'Usuario no encontrado' };
      }
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      return { success: false, message: 'Error del servidor' };
    }
  };

  const handleEstablecerContraseniaUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEstablecerContrasenia(true);
  };

  const handleResetearContrasenia = async (usuario) => {
    try {
      await updateUsuario(usuario.usuario, { reset: true });
      console.log('Contraseña reseteada para:', usuario.usuario);
      // Podrías mostrar una notificación de éxito aquí
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarUsuario(true);
  };

  const handleGuardarEdicionUsuario = async (datosUsuario) => {
    try {
      await updateUsuario(datosUsuario.usuario, datosUsuario);
      console.log('Usuario actualizado:', datosUsuario);
      // Aquí podrías actualizar el estado o recargar la lista
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
          Usuarios
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setModalOlvideContrasenia(true)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Key className="w-4 h-4 inline mr-2" />
            Recuperar Contraseña
          </button>
          <button
            onClick={() => setModalCrearUsuario(true)}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#3F7416' }}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsuarios}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{usuariosActivos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6" style={{ color: '#3F7416' }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">{administradores}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsuarios - usuariosActivos}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
              Lista de Usuarios
            </h2>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="cajero">Cajero</option>
                <option value="inventario">Inventario</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contraseña
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-medium text-sm">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {usuario.codigo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.usuario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      usuario.rol_descripcion === 'admin' ? 'bg-purple-100 text-purple-800' :
                      usuario.rol_descripcion === 'cajero' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {usuario.rol_descripcion === 'admin' ? 'Administrador' : 
                       usuario.rol_descripcion === 'cajero' ? 'Cajero' : 
                       'Inventario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(usuario.fecha_registro).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      usuario.habilitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.habilitado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      usuario.reset ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {usuario.reset ? 'Pendiente' : 'Configurada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditarUsuario(usuario)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Editar
                      </button>

                      <button 
                        onClick={() => handleResetearContrasenia(usuario)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        <RotateCcw className="w-4 h-4 inline mr-1" />
                        Reset
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ModalCrearUsuario
        isOpen={modalCrearUsuario}
        onClose={() => setModalCrearUsuario(false)}
        onSave={handleCrearUsuario}
      />

      <ModalEditarUsuario
        isOpen={modalEditarUsuario}
        onClose={() => {
          setModalEditarUsuario(false);
          setUsuarioSeleccionado(null);
        }}
        onSave={handleGuardarEdicionUsuario}
        usuario={usuarioSeleccionado}
        roles={data?.rol || []}
      />

      <ModalEstablecerContrasenia
        isOpen={modalEstablecerContrasenia}
        onClose={() => {
          setModalEstablecerContrasenia(false);
          setUsuarioSeleccionado(null);
        }}
        onSave={handleEstablecerContrasenia}
        usuario={usuarioSeleccionado}
      />

      <ModalOlvideContrasenia
        isOpen={modalOlvideContrasenia}
        onClose={() => setModalOlvideContrasenia(false)}
        onRecuperarContrasenia={handleRecuperarContrasenia}
      />
    </div>
  );
};

export default Usuarios;