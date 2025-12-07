import { useState, useEffect } from 'react';
import ventasService from '../../services/ventasService';
import clientesService from '../../services/clientesService';
import { generarTicketPDF } from '../../utils/generarTicketPDF';

/**
 * Custom Hook para procesamiento de ventas
 * 
 * Maneja el flujo completo de procesamiento de ventas:
 * - Gestión de clientes y descuentos de fidelidad
 * - Procesamiento y envío de venta al backend
 * - Generación de comprobantes PDF
 * - Manejo de modales y estados de proceso
 * 
 * @param {Array} productosVenta - Productos en el carrito
 * @param {Object} calculos - Cálculos de la venta (subtotal, igv, total, etc.)
 * @param {Object} user - Usuario actual
 * @param {Function} updateInventario - Función para actualizar inventario local
 * @param {Object} database - Base de datos local
 * @param {Function} limpiarCarrito - Función para limpiar el carrito
 * @param {string} metodoPago - Método de pago seleccionado
 * @returns {Object} Estado y funciones para procesamiento de ventas
 */
export const useVentaProcess = (
    productosVenta,
    calculos,
    user,
    updateInventario,
    database,
    limpiarCarrito,
    metodoPago
) => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [clienteDNI, setClienteDNI] = useState('');
    const [aplicaDescuentoFidelidad, setAplicaDescuentoFidelidad] = useState(false);
    const [porcentajeDescuentoFidelidad, setPorcentajeDescuentoFidelidad] = useState(0);
    const [mostrarDescuentoFidelidad, setMostrarDescuentoFidelidad] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [ventaExitosa, setVentaExitosa] = useState(false);
    const [ventaCreadaData, setVentaCreadaData] = useState(null);
    const [selectedVendedor, setSelectedVendedor] = useState('');

    // Verificar descuento de fidelidad desde el backend
    const verificarDescuentoFidelidad = async (idCliente) => {
        if (!idCliente) {
            setAplicaDescuentoFidelidad(false);
            setPorcentajeDescuentoFidelidad(0);
            return;
        }

        try {
            const { aplicaDescuentoFidelidad, porcentaje } = await clientesService.verificarDescuentoFidelidad(idCliente);
            setAplicaDescuentoFidelidad(aplicaDescuentoFidelidad);
            setPorcentajeDescuentoFidelidad(porcentaje || 0);
        } catch (error) {
            console.error('Error al verificar descuento de fidelidad:', error);
            setAplicaDescuentoFidelidad(false);
            setPorcentajeDescuentoFidelidad(0);
        }
    };

    // Guardar cliente seleccionado
    const guardarCliente = async (cliente) => {
        console.log('Cliente seleccionado:', cliente);
        setClienteDNI(cliente.dni || cliente.numeroDocumento);
        setClienteSeleccionado(cliente);
        setShowClienteModal(false);

        if (cliente.idCliente || cliente.id) {
            await verificarDescuentoFidelidad(cliente.idCliente || cliente.id);
        }
    };

    // Procesar venta y generar comprobante
    const procesarVenta = async () => {
        if (productosVenta.length === 0) {
            alert('Agregue productos a la venta');
            return;
        }

        if (!selectedVendedor) {
            alert('Seleccione un vendedor');
            return;
        }

        setShowModal(true);
        setIsProcessing(true);
        setVentaExitosa(false);

        try {
            const ventaData = {
                idUsuario: user?.id_usuario || user?.idUsuario,
                idCliente: clienteSeleccionado?.idCliente || clienteSeleccionado?.id || null,
                descuentoTotal: calculos.descuentoFidelidad + calculos.descuentoProductos,
                subtotal: calculos.subtotal,
                igv: calculos.igv,
                total: calculos.total,
                detalles: productosVenta.map(p => ({
                    idProducto: p.id_producto,
                    idOferta: p.descuento?.id_oferta || null,
                    descuentoItem: p.descuento_valor || 0,
                    precio: p.precio_venta,
                    cantidad: p.cantidad
                }))
            };

            console.log('📤 Enviando venta al backend:', ventaData);

            const ventaCreada = await ventasService.create(ventaData);

            console.log('✅ Venta procesada exitosamente:', ventaCreada);

            setVentaCreadaData(ventaCreada);

            // Actualizar stock localmente
            const inventarioActualizado = { ...database };
            productosVenta.forEach(producto => {
                const inventarioActual = inventarioActualizado?.inventario?.find(
                    inv => inv.id_producto === producto.id_producto && inv.habilitado
                );
                if (inventarioActual) {
                    const nuevoStock = inventarioActual.stock - producto.cantidad;
                    updateInventario(producto.id_producto, inventarioActual.id_movimiento_cab, nuevoStock, inventarioActual.precio);
                }
            });

            setIsProcessing(false);
            setVentaExitosa(true);

        } catch (error) {
            console.error('❌ Error procesando venta:', error);

            // Guardar en localStorage como fallback
            console.warn('Guardando venta en localStorage como respaldo...');
            const ventaData = {
                id: Date.now(),
                fecha: new Date().toISOString(),
                vendedor: selectedVendedor,
                cliente: clienteDNI || 'Sin registro',
                productos: productosVenta.map(p => {
                    const precioFinal = p.precio_con_descuento || p.precio_venta;
                    return {
                        id_producto: p.id_producto,
                        nombre: p.nombre,
                        cantidad: p.cantidad,
                        precio_unitario: p.precio_venta,
                        precio_con_descuento: precioFinal,
                        descuento_aplicado: p.descuento ? {
                            nombre: p.descuento.nombre,
                            tipo: p.descuento.tipo_descuento,
                            valor: p.descuento_valor
                        } : null,
                        subtotal: (precioFinal / 1.18) * p.cantidad,
                        igv: ((precioFinal / 1.18) * 0.18) * p.cantidad,
                        total: precioFinal * p.cantidad
                    };
                }),
                subtotal: calculos.subtotal,
                igv: calculos.igv,
                descuento_productos: calculos.descuentoProductos,
                descuento_fidelidad: {
                    porcentaje: porcentajeDescuentoFidelidad,
                    monto: calculos.descuentoFidelidad
                },
                total: calculos.total,
                metodoPago: metodoPago
            };

            const ventasExistentes = JSON.parse(localStorage.getItem('sivi_ventas') || '[]');
            ventasExistentes.push(ventaData);
            localStorage.setItem('sivi_ventas', JSON.stringify(ventasExistentes));

            // Actualizar stock local
            const inventarioActualizado = { ...database };
            productosVenta.forEach(producto => {
                const inventarioActual = inventarioActualizado?.inventario?.find(
                    inv => inv.id_producto === producto.id_producto && inv.habilitado
                );
                if (inventarioActual) {
                    const nuevoStock = inventarioActual.stock - producto.cantidad;
                    updateInventario(producto.id_producto, inventarioActual.id_movimiento_cab, nuevoStock, inventarioActual.precio);
                    inventarioActual.stock = nuevoStock;
                }
            });
            localStorage.setItem('sivi_inventario_temp', JSON.stringify(inventarioActualizado.inventario));

            alert('Venta guardada localmente. Sincronizar con el servidor cuando esté disponible.');
            setIsProcessing(false);
            setVentaExitosa(true);
        }
    };

    // Imprimir comprobante
    const imprimirComprobante = () => {
        if (!ventaCreadaData) {
            console.error('No hay datos de venta para imprimir');
            alert('Error: No se encontraron datos de la venta');
            return;
        }

        try {
            const ahora = new Date();
            const fechaFormato = ahora.toISOString()
                .replace(/[-:]/g, '')
                .replace('T', '_')
                .split('.')[0];

            generarTicketPDF({
                codigo: ventaCreadaData.codigo,
                fecha: ventaCreadaData.fechaVenta || new Date().toISOString(),
                vendedor: selectedVendedor,
                clienteNombre: clienteSeleccionado?.nombres || clienteSeleccionado?.nombre || 'Sin registro',
                clienteDNI: clienteDNI || 'Sin registro',
                productos: productosVenta.map(p => ({
                    nombre: p.nombre,
                    cantidad: p.cantidad,
                    precio_unitario: p.precio_venta,
                    precio_con_descuento: p.precio_con_descuento || p.precio_venta,
                    descuento_aplicado: p.descuento ? {
                        nombre: p.descuento.nombre,
                        tipo: p.descuento.tipo_descuento,
                        valor: p.descuento_valor
                    } : null
                })),
                subtotal: calculos.subtotal,
                igv: calculos.igv,
                descuento_productos: calculos.descuentoProductos,
                descuento_fidelidad: {
                    porcentaje: porcentajeDescuentoFidelidad,
                    monto: calculos.descuentoFidelidad
                },
                total: calculos.total,
                metodoPago: metodoPago,
                fechaFormato: fechaFormato
            });

            console.log('✅ Ticket PDF generado exitosamente');
        } catch (error) {
            console.error('❌ Error al generar ticket PDF:', error);
            alert('Error al generar el ticket. Por favor intente nuevamente.');
        }

        cerrarModal();
    };

    // Cerrar modal y limpiar formulario
    const cerrarModal = () => {
        setShowModal(false);
        setIsProcessing(false);
        setVentaExitosa(false);
        setClienteDNI('');
        setClienteSeleccionado(null);
        setVentaCreadaData(null);
        limpiarCarrito();
    };

    // Inicializar vendedor actual automáticamente
    useEffect(() => {
        if (user) {
            setSelectedVendedor(user.username || '');
        }
    }, [user]);

    // Actualizar descuento de fidelidad cuando cambie el cliente
    useEffect(() => {
        const actualizarDescuento = async () => {
            if (clienteSeleccionado?.idCliente) {
                await verificarDescuentoFidelidad(clienteSeleccionado.idCliente);
                setMostrarDescuentoFidelidad(aplicaDescuentoFidelidad);
            } else {
                setAplicaDescuentoFidelidad(false);
                setPorcentajeDescuentoFidelidad(0);
                setMostrarDescuentoFidelidad(false);
            }
        };

        actualizarDescuento();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clienteSeleccionado]);

    return {
        // Estado de cliente
        cliente: clienteSeleccionado,
        clienteDNI,
        setClienteDNI,

        // Descuento de fidelidad
        aplicaDescuentoFidelidad,
        porcentajeDescuentoFidelidad,
        mostrarDescuentoFidelidad,

        // Modales
        showModal,
        showClienteModal,
        setShowClienteModal,
        isProcessing,
        ventaExitosa,

        // Vendedor
        selectedVendedor,
        setSelectedVendedor,

        // Funciones
        guardarCliente,
        procesarVenta,
        imprimirComprobante,
        cerrarModal
    };
};
