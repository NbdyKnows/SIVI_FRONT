import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
// --- IMPORTACIONES DE SERVICIOS Y CONTEXTO ---
import comprasService from '../../services/comprasService';
import { useAuth } from '../../contexts/AuthContext';

const ModalNuevaCompra = ({ isOpen, onClose, onSuccess, proveedores = [], productos = [] }) => {
  const { user } = useAuth(); // Obtenemos el usuario logueado del contexto

  const [idProveedor, setIdProveedor] = useState('');
  const [items, setItems] = useState([]);
  
  // Estado para el item que se está agregando
  const [currentItem, setCurrentItem] = useState({
    id_producto: '',
    cantidad: 1,
    precio_compra: ''
  });

  const [resumen, setResumen] = useState({
    subtotal: 0,
    igv: 0,
    total: 0
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constantes de validación (Seguridad de Negocio)
  const MAX_PRECIO = 9999.99;
  const MAX_CANTIDAD = 500;

  // Resetear formulario al abrir
  useEffect(() => {
    if (isOpen) {
      console.log('Productos recibidos en modal:', productos); // Logging para debug
      setIdProveedor('');
      setItems([]);
      setCurrentItem({ id_producto: '', cantidad: 1, precio_compra: '' });
      setResumen({ subtotal: 0, igv: 0, total: 0 });
      setError('');
      setSuccessMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Calcular totales cuando cambian los items
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.cantidad * item.precio_compra), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    setResumen({ subtotal, igv, total });
  }, [items]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real para inputs numéricos
    if (name === 'precio_compra' || name === 'cantidad') {
        if (value < 0) return; // No negativos
        // Límite visual de caracteres para evitar desbordes en UI
        if (value.length > 9) return; 
    }

    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    // 1. Validaciones básicas
    if (!currentItem.id_producto) return setError('Selecciona un producto');
    if (currentItem.cantidad <= 0) return setError('Cantidad inválida');
    if (!currentItem.precio_compra || currentItem.precio_compra < 0) return setError('Precio inválido');

    // 2. Validaciones de Negocio (Topes)
    if (parseFloat(currentItem.precio_compra) > MAX_PRECIO) {
      return setError(`El precio unitario no puede superar S/ ${MAX_PRECIO}`);
    }
    if (parseInt(currentItem.cantidad) > MAX_CANTIDAD) {
      return setError(`La cantidad no puede superar las ${MAX_CANTIDAD} unidades`);
    }

    // CORRECCIÓN: Usamos idProducto (camelCase) que viene del backend Java
    const productoInfo = productos.find(p => String(p.idProducto) === String(currentItem.id_producto));
    
    const newItem = {
      id_producto: parseInt(currentItem.id_producto),
      nombre: productoInfo?.descripcion || 'Desconocido',
      cantidad: parseInt(currentItem.cantidad),
      precio_compra: parseFloat(currentItem.precio_compra),
      subtotalLinea: parseInt(currentItem.cantidad) * parseFloat(currentItem.precio_compra)
    };

    setItems([...items, newItem]);
    // Resetear inputs de item
    setCurrentItem({ id_producto: '', cantidad: 1, precio_compra: '' });
    setError('');
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validaciones Finales
    if (!idProveedor) return setError('Selecciona un proveedor');
    if (items.length === 0) return setError('Agrega al menos un producto a la orden');
    if (!user || !user.id_usuario) return setError('Error de sesión: No se pudo identificar al usuario.');

    setIsSubmitting(true);

    // Construir DTO según OrdenCompraRequestDTO de Java
    const ordenCompraDTO = {
      idUsuario: user.id_usuario, // ID del usuario logueado
      idProveedor: parseInt(idProveedor),
      detalles: items.map(item => ({
        idProducto: item.id_producto,
        cantidad: item.cantidad,
        precio: item.precio_compra
      }))
    };

    try {
      // --- LLAMADA AL SERVICIO ---
      await comprasService.registrarCompra(ordenCompraDTO);
      
      setSuccessMessage('Orden de compra registrada correctamente.');
      
      // Notificar al padre y cerrar después de un breve delay
      setTimeout(() => {
        if (onSuccess) onSuccess(); // Recargar lista en el componente padre
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Error al registrar compra:", err);
      setError(err.message || 'Ocurrió un error al guardar la orden.');
      setIsSubmitting(false);
    }
  };

  // Estilos constantes
  const PRIMARY_COLOR = '#3F7416';
  const HOVER_COLOR = '#2F5A10';

  const buttonStyle = {
    backgroundColor: PRIMARY_COLOR,
    color: 'white',
    transition: 'all 0.2s ease'
  };

  const handleMouseEnter = (e) => {
    if (!e.target.disabled) e.target.style.backgroundColor = HOVER_COLOR;
  };

  const handleMouseLeave = (e) => {
    if (!e.target.disabled) e.target.style.backgroundColor = PRIMARY_COLOR;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ShoppingCart className="w-6 h-6" style={{ color: PRIMARY_COLOR }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registrar Orden de Compra</h2>
              <p className="text-sm text-gray-500">La orden se creará en estado PENDIENTE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={isSubmitting}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Mensaje de Éxito */}
          {successMessage && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* 1. Datos Generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Proveedor *</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm"
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">-- Seleccione un proveedor --</option>
                {proveedores.map(p => (
                  <option key={p.idProveedor} value={p.idProveedor}>
                    {p.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fecha de Emisión</label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed font-medium"
                value={new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              />
            </div>
          </div>

          {/* 2. Sección Agregar Productos */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2 uppercase tracking-wide">
              <Plus className="w-4 h-4" style={{ color: PRIMARY_COLOR }} /> 
              Agregar Detalle de Producto
            </h3>
            
            <div className="flex flex-col gap-4">
              {/* Selección de Producto */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Producto</label>
                <select
                  name="id_producto"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm"
                  value={currentItem.id_producto}
                  onChange={handleItemChange}
                  disabled={isSubmitting}
                >
                  <option value="">-- Buscar producto en catálogo --</option>
                  {productos.map(p => (
                    <option key={p.idProducto} value={p.idProducto}>
                      {p.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad, Precio y Botón */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    min="1"
                    max={MAX_CANTIDAD}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm text-center font-medium"
                    value={currentItem.cantidad}
                    onChange={handleItemChange}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Costo Unitario (S/.)</label>
                  <input
                    type="number"
                    name="precio_compra"
                    min="0"
                    max={MAX_PRECIO}
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm text-right font-medium"
                    value={currentItem.precio_compra}
                    onChange={handleItemChange}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg shadow-md text-sm font-bold active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={buttonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* 3. Tabla de Items */}
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Producto</th>
                    <th className="px-6 py-3 text-center">Cant.</th>
                    <th className="px-6 py-3 text-right">Costo Unit.</th>
                    <th className="px-6 py-3 text-right">Subtotal</th>
                    <th className="px-6 py-3 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic bg-gray-50">No hay productos agregados a la orden</td></tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">{item.nombre}</td>
                        <td className="px-6 py-3 text-center">{item.cantidad}</td>
                        <td className="px-6 py-3 text-right">S/ {item.precio_compra.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right font-medium">S/ {item.subtotalLinea.toFixed(2)}</td>
                        <td className="px-6 py-3 text-center">
                          <button 
                            onClick={() => handleRemoveItem(idx)} 
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {items.length > 0 && (
                  <tfoot className="bg-gray-50 text-gray-900 border-t-2 border-gray-200">
                    <tr>
                      <td colSpan="3" className="px-6 py-2 text-right text-gray-600 text-xs uppercase font-bold">Subtotal:</td>
                      <td className="px-6 py-2 text-right font-medium">S/ {resumen.subtotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-6 py-2 text-right text-gray-600 text-xs uppercase font-bold">IGV (18%):</td>
                      <td className="px-6 py-2 text-right font-medium">S/ {resumen.igv.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr className="bg-green-50 border-t border-green-200">
                      <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-900 text-sm uppercase">TOTAL A PAGAR:</td>
                      <td className="px-6 py-4 text-right font-bold text-xl" style={{ color: PRIMARY_COLOR }}>S/ {resumen.total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors shadow-sm" 
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || items.length === 0}
            className="px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Confirmar Compra
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNuevaCompra;