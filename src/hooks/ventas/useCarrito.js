import { useState } from 'react';
import { calcularVenta } from '../../utils/ventasCalculos';

/**
 * Custom Hook para gestión del carrito de compras
 * 
 * Maneja agregar, quitar y editar productos en el carrito
 * Calcula subtotales, descuentos, IGV y total
 * 
 * @param {boolean} aplicaDescuentoFidelidad - Si aplica descuento de fidelidad
 * @param {number} porcentajeDescuentoFidelidad - Porcentaje de descuento de fidelidad
 * @returns {Object} Estado y funciones para gestión del carrito
 */
export const useCarrito = (aplicaDescuentoFidelidad, porcentajeDescuentoFidelidad) => {
    const [productosVenta, setProductosVenta] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);

    // Seleccionar producto para agregar
    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setCantidadSeleccionada(1);
    };

    // Agregar producto con cantidad específica
    const agregarProducto = () => {
        if (!productoSeleccionado) return;

        const stockDisponible = productoSeleccionado.stock;
        const productoExistente = productosVenta.find(p => p.id_producto === productoSeleccionado.id_producto);
        const cantidadExistente = productoExistente ? productoExistente.cantidad : 0;

        if (cantidadExistente + cantidadSeleccionada > stockDisponible) {
            alert(`Stock insuficiente. Disponible: ${stockDisponible - cantidadExistente}`);
            return;
        }

        if (productoExistente) {
            setProductosVenta(prev =>
                prev.map(p =>
                    p.id_producto === productoSeleccionado.id_producto
                        ? { ...p, cantidad: p.cantidad + cantidadSeleccionada }
                        : p
                )
            );
        } else {
            setProductosVenta(prev => [...prev, {
                ...productoSeleccionado,
                cantidad: cantidadSeleccionada
            }]);
        }

        // Limpiar selección
        setProductoSeleccionado(null);
        setCantidadSeleccionada(1);
    };

    // Quitar producto de la venta
    const quitarProducto = (idProducto) => {
        setProductosVenta(prev => prev.filter(p => p.id_producto !== idProducto));
    };

    // Editar cantidad de producto en la venta
    const editarCantidad = (idProducto, nuevaCantidad) => {
        setProductosVenta(prev =>
            prev.map(p =>
                p.id_producto === idProducto
                    ? { ...p, cantidad: nuevaCantidad }
                    : p
            )
        );
    };

    // Limpiar carrito
    const limpiarCarrito = () => {
        setProductosVenta([]);
        setProductoSeleccionado(null);
        setCantidadSeleccionada(1);
    };

    // Calcular todos los valores de la venta
    const calculos = calcularVenta(productosVenta, aplicaDescuentoFidelidad, porcentajeDescuentoFidelidad);

    return {
        items: productosVenta,
        productoSeleccionado,
        cantidadSeleccionada,
        setCantidadSeleccionada,
        agregarProducto,
        quitarProducto,
        editarCantidad,
        seleccionarProducto,
        limpiarCarrito,
        ...calculos // subtotal, descuentoProductos, descuentoFidelidad, igv, total
    };
};
