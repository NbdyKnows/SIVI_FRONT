import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import ModalReporteVentas from '../components/modales/ModalReporteVentas';
import ModalReporteInventario from '../components/modales/ModalReporteInventario';
import ModalReporteFinanciero from '../components/modales/ModalReporteFinanciero';
import {
  generarReporteDeVentas,
  generarReporteInventario,
  generarReporteFinanciero
} from '../services/reportesService';

const Reportes = () => {
  const [modalActivo, setModalActivo] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');

  const cerrarModal = () => setModalActivo(null);
  const handleGenerateVentas = async (opciones) => {
    console.log('Solicitando reporte de ventas al backend...', opciones);
    try {
      await generarReporteDeVentas(opciones);
      cerrarModal();
    } catch (error) {
      console.error("Error en vista ventas:", error);
    }
  };
  const handleGenerateInventario = async (opciones) => {
    console.log('Solicitando reporte de inventario al backend...', opciones);
    try {
      await generarReporteInventario(opciones);
      cerrarModal();
    } catch (error) {
      console.error("Error en vista inventario:", error);
    }
  };
  const handleGenerateFinanciero = async (opciones) => {
    console.log('Solicitando reporte financiero...', opciones);
    try {
      await generarReporteFinanciero(opciones);
      cerrarModal();
    } catch (error) {
      console.error("Error en vista financiero:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-green">
          Reportes
        </h1>
        <p className="text-gray-600 mt-2">
          Genera y administra reportes detallados de tu negocio
        </p>
      </div>
      {/* Categorías de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta Ventas */}
        <div
          onClick={() => setModalActivo('ventas')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <Download className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes de Ventas</h3>
          <p className="text-sm text-gray-500 mb-4">Análisis detallado de ventas por período</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Último reporte:</span>
              <span className="text-gray-900">hace 2 horas</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frecuencia:</span>
              <span className="text-gray-900">Diario</span>
            </div>
          </div>
        </div>
        {/* Tarjeta Inventario */}
        <div
          onClick={() => setModalActivo('inventario')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="w-6 h-6 text-primary-green" />
            </div>
            <Download className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventario</h3>
          <p className="text-sm text-gray-500 mb-4">Estado actual del stock y movimientos</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Último reporte:</span>
              <span className="text-gray-900">hace 6 horas</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frecuencia:</span>
              <span className="text-gray-900">Semanal</span>
            </div>
          </div>
        </div>
        {/* Tarjeta Financiero */}
        <div
          onClick={() => setModalActivo('financiero')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <Download className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes Financieros</h3>
          <p className="text-sm text-gray-500 mb-4">Estados financieros y análisis contable</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Último reporte:</span>
              <span className="text-gray-900">hace 1 día</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frecuencia:</span>
              <span className="text-gray-900">Mensual</span>
            </div>
          </div>
        </div>
      </div>
      {/* Tabla de Reportes Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary-green">
              Reportes Recientes
            </h2>
            <div className="flex space-x-3">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-states-focus focus:border-states-focus"
              >
                <option value="todos">Todos los tipos</option>
                <option value="ventas">Ventas</option>
                <option value="inventario">Inventario</option>
                <option value="financieros">Financieros</option>
              </select>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-states-focus focus:border-states-focus"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Reporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Generación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
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
              {[...Array(7)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {['Reporte Ventas Diario', 'Inventario Semanal', 'Estado Financiero', 'Productos Más Vendidos', 'Análisis de Compras', 'Reporte de Descuentos', 'Balance General'][index]}
                    </div>
                    <div className="text-sm text-gray-500">
                      RPT-{String(index + 1).padStart(3, '0')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      index % 3 === 0 ? 'bg-blue-100 text-blue-800' :
                      index % 3 === 1 ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {index % 3 === 0 ? 'Ventas' : index % 3 === 1 ? 'Inventario' : 'Financiero'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {['Diario', 'Semanal', 'Mensual'][index % 3]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Completado
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Descargar</button>
                    <button className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal de Ventas */}
      {modalActivo === 'ventas' && (
        <ModalReporteVentas
          isOpen={true}
          onClose={cerrarModal}
          onGenerate={handleGenerateVentas}
        />
      )}
      {/* Modal de Inventario */}
      {modalActivo === 'inventario' && (
        <ModalReporteInventario
          isOpen={true}
          onClose={cerrarModal}
          onGenerate={handleGenerateInventario}
        />
      )}
      {/* Modal de Financiero */}
      {modalActivo === 'financiero' && (
        <ModalReporteFinanciero
          isOpen={true}
          onClose={cerrarModal}
          onGenerate={handleGenerateFinanciero}
        />
      )}

    </div>
  );
};

export default Reportes;
