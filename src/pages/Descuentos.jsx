import React, { useState, useEffect } from 'react';
import { Percent, Tag, Calendar, TrendingDown, Edit, Trash2, Plus, Package, Grid, Eye } from 'lucide-react';
import { ModalDescuento } from '../components/modales';
import { descuentosService } from '../services';

const Descuentos = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    activos: 0,
    productosConDescuento: 0,
    ahorroTotal: 0,
    proximosVencer: 0
  });
  const [modalDescuentoOpen, setModalDescuentoOpen] = useState(false);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [cargando, setCargando] = useState(true);

  // Cargar descuentos desde el backend
  useEffect(() => {
    cargarDescuentos();
    cargarEstadisticas();
  }, []);

  const cargarDescuentos = async () => {
    try {
      setCargando(true);
      const data = await descuentosService.getAll();
      setDescuentos(data);
      console.log('✅ Descuentos cargados desde el backend:', data.length);
    } catch (error) {
      console.error('❌ Error al cargar descuentos del backend, usando localStorage:', error);
      // Fallback a localStorage
      const descuentosGuardados = localStorage.getItem('descuentos_sivi');
      if (descuentosGuardados) {
        setDescuentos(JSON.parse(descuentosGuardados));
      } else {
        // Datos de ejemplo
        const descuentosEjemplo = [
          {
            id: 1,
            nombre: 'Descuento Navideño',
            descripcion: 'Promoción especial por Navidad',
            tipo_aplicacion: 'categoria',
            tipo_descuento: 'porcentaje',
            valor: 15,
            fecha_inicio: '2024-12-01',
            fecha_fin: '2024-12-31',
            productos_seleccionados: [],
            categorias_seleccionadas: [
              { id: 'bebidas', nombre: 'Bebidas', productos_count: 15 },
              { id: 'snacks', nombre: 'Snacks', productos_count: 23 }
            ],
            activo: true,
            fecha_creacion: '2024-11-15T10:00:00.000Z'
          },
          {
            id: 2,
            nombre: 'Productos Lácteos',
            descripcion: 'Descuento en productos lácteos seleccionados',
            tipo_aplicacion: 'producto',
            tipo_descuento: 'monto_fijo',
            valor: 2.50,
            fecha_inicio: '2024-12-15',
            fecha_fin: '2025-01-15',
            productos_seleccionados: [
              { id: 3, nombre: 'Leche Gloria 1L', categoria: 'Lácteos', precio: 4.80 },
              { id: 6, nombre: 'Yogurt Gloria', categoria: 'Lácteos', precio: 2.50 }
            ],
            categorias_seleccionadas: [],
            activo: true,
            fecha_creacion: '2024-11-20T14:30:00.000Z'
          }
        ];
        setDescuentos(descuentosEjemplo);
        localStorage.setItem('descuentos_sivi', JSON.stringify(descuentosEjemplo));
      }
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await descuentosService.getEstadisticas();
      setEstadisticas(stats);
      console.log('✅ Estadísticas cargadas desde el backend');
    } catch (error) {
      console.warn('⚠️ Error al cargar estadísticas del backend, calculando localmente:', error);
      // Calcular estadísticas localmente como fallback
      calcularEstadisticasLocales();
    }
  };

  const calcularEstadisticasLocales = () => {
    const stats = {
      activos: descuentos.filter(d => d.activo && new Date(d.fecha_fin) >= new Date()).length,
      productosConDescuento: descuentos.reduce((total, d) => {
        if (d.tipo_aplicacion === 'producto') {
          return total + d.productos_seleccionados.length;
        } else {
          return total + d.categorias_seleccionadas.reduce((sum, cat) => sum + cat.productos_count, 0);
        }
      }, 0),
      ahorroTotal: descuentos.reduce((total, d) => {
        if (d.tipo_descuento === 'monto_fijo') {
          return total + parseFloat(d.valor) * 10; // Estimación
        }
        return total + 50; // Estimación para porcentajes
      }, 0),
      proximosVencer: descuentos.filter(d => {
        const fechaFin = new Date(d.fecha_fin);
        const hoy = new Date();
        const diasRestantes = (fechaFin - hoy) / (1000 * 60 * 60 * 24);
        return diasRestantes <= 7 && diasRestantes > 0;
      }).length
    };
    setEstadisticas(stats);
  };

  // Guardar descuentos en localStorage (fallback)
  const guardarDescuentos = (nuevosDescuentos) => {
    setDescuentos(nuevosDescuentos);
    localStorage.setItem('descuentos_sivi', JSON.stringify(nuevosDescuentos));
  };

  const handleCrearDescuento = () => {
    setDescuentoSeleccionado(null);
    setModalDescuentoOpen(true);
  };

  const handleEditarDescuento = (descuento) => {
    setDescuentoSeleccionado(descuento);
    setModalDescuentoOpen(true);
  };

  const handleGuardarDescuento = async (descuentoData) => {
    try {
      if (descuentoSeleccionado) {
        // Editar descuento existente
        const descuentoActualizado = await descuentosService.update(
          descuentoSeleccionado.id, 
          descuentoData
        );
        const nuevosDescuentos = descuentos.map(d => 
          d.id === descuentoSeleccionado.id ? descuentoActualizado : d
        );
        setDescuentos(nuevosDescuentos);
        console.log('✅ Descuento actualizado en el backend');
      } else {
        // Crear nuevo descuento
        const nuevoDescuento = await descuentosService.create(descuentoData);
        setDescuentos([...descuentos, nuevoDescuento]);
        console.log('✅ Descuento creado en el backend');
      }
      // Recargar estadísticas
      cargarEstadisticas();
    } catch (error) {
      console.error('❌ Error al guardar descuento en el backend, usando localStorage:', error);
      // Fallback a localStorage
      if (descuentoSeleccionado) {
        const nuevosDescuentos = descuentos.map(d => 
          d.id === descuentoSeleccionado.id ? descuentoData : d
        );
        guardarDescuentos(nuevosDescuentos);
      } else {
        const nuevosDescuentos = [...descuentos, descuentoData];
        guardarDescuentos(nuevosDescuentos);
      }
      calcularEstadisticasLocales();
    }
    setModalDescuentoOpen(false);
    setDescuentoSeleccionado(null);
  };

  const handleEliminarDescuento = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este descuento?')) {
      try {
        await descuentosService.delete(id);
        const nuevosDescuentos = descuentos.filter(d => d.id !== id);
        setDescuentos(nuevosDescuentos);
        console.log('✅ Descuento eliminado del backend');
        // Recargar estadísticas
        cargarEstadisticas();
      } catch (error) {
        console.error('❌ Error al eliminar descuento del backend, usando localStorage:', error);
        // Fallback a localStorage
        const nuevosDescuentos = descuentos.filter(d => d.id !== id);
        guardarDescuentos(nuevosDescuentos);
        calcularEstadisticasLocales();
      }
    }
  };

  // Filtrar descuentos según estado
  const descuentosFiltrados = descuentos.filter(descuento => {
    const hoy = new Date();
    const fechaInicio = new Date(descuento.fecha_inicio);
    const fechaFin = new Date(descuento.fecha_fin);

    switch (filtroEstado) {
      case 'activos':
        return descuento.activo && fechaInicio <= hoy && fechaFin >= hoy;
      case 'proximos':
        return descuento.activo && fechaInicio > hoy;
      case 'vencidos':
        return fechaFin < hoy;
      default:
        return true;
    }
  });

  const getEstadoDescuento = (descuento) => {
    const hoy = new Date();
    const fechaInicio = new Date(descuento.fecha_inicio);
    const fechaFin = new Date(descuento.fecha_fin);

    if (!descuento.activo) return { estado: 'Inactivo', clase: 'bg-gray-100 text-gray-800' };
    if (fechaFin < hoy) return { estado: 'Vencido', clase: 'bg-red-100 text-red-800' };
    if (fechaInicio > hoy) return { estado: 'Próximo', clase: 'bg-yellow-100 text-yellow-800' };
    return { estado: 'Activo', clase: 'bg-green-100 text-green-800' };
  };
  
  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando descuentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#3F7416' }}>
          Descuentos
        </h1>
        <button
          onClick={handleCrearDescuento}
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          style={{ backgroundColor: '#3F7416' }}
        >
          <Plus className="w-4 h-4" />
          Crear Descuento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Descuentos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.activos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Percent className="w-6 h-6" style={{ color: '#3F7416' }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Productos con Descuento</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.productosConDescuento}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>



        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Próximos a Vencer</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.proximosVencer}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
              Lista de Descuentos ({descuentosFiltrados.length})
            </h2>
            <div className="flex space-x-3">
              <select 
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="activos">Activos</option>
                <option value="proximos">Próximos</option>
                <option value="vencidos">Vencidos</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aplicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {descuentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Percent className="w-8 h-8 text-gray-300" />
                      <span>No hay descuentos registrados</span>
                      <button
                        onClick={handleCrearDescuento}
                        className="mt-2 text-sm text-green-600 hover:text-green-800"
                      >
                        Crear el primer descuento
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                descuentosFiltrados.map((descuento) => {
                  const estadoInfo = getEstadoDescuento(descuento);
                  return (
                    <tr key={descuento.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {descuento.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {descuento.descripcion || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {descuento.tipo_aplicacion === 'producto' ? (
                            <Package className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Grid className="w-4 h-4 text-purple-500" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {descuento.tipo_aplicacion === 'producto' ? 'Productos' : 'Categorías'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {descuento.tipo_aplicacion === 'producto' 
                                ? `${descuento.productos_seleccionados.length} seleccionados`
                                : `${descuento.categorias_seleccionadas.length} seleccionadas`
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {descuento.tipo_descuento === 'porcentaje' 
                            ? `${descuento.valor}%` 
                            : `S/ ${parseFloat(descuento.valor).toFixed(2)}`
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          {descuento.tipo_descuento === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(descuento.fecha_inicio).toLocaleDateString()}</div>
                        <div>{new Date(descuento.fecha_fin).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoInfo.clase}`}>
                          {estadoInfo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditarDescuento(descuento)}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                            title="Editar descuento"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEliminarDescuento(descuento.id)}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                            title="Eliminar descuento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Descuento */}
      <ModalDescuento
        isOpen={modalDescuentoOpen}
        onClose={() => {
          setModalDescuentoOpen(false);
          setDescuentoSeleccionado(null);
        }}
        onSave={handleGuardarDescuento}
        descuento={descuentoSeleccionado}
      />
    </div>
  );
};

export default Descuentos;