export const calcularSubtotal = (productos) => {
    return productos.reduce((sum, producto) => {
        const precioFinal = producto.precio_con_descuento || producto.precio_venta;
        const precioSinIGV = precioFinal / 1.18; // Precio sin IGV
        return sum + (precioSinIGV * producto.cantidad);
    }, 0);
};


export const calcularDescuentoProductos = (productos) => {
    return productos.reduce((sum, producto) => {
        if (producto.descuento_valor && producto.precio_venta > (producto.precio_con_descuento || producto.precio_venta)) {
            const descuentoPorUnidad = producto.precio_venta - (producto.precio_con_descuento || producto.precio_venta);
            return sum + (descuentoPorUnidad * producto.cantidad);
        }
        return sum;
    }, 0);
};


export const calcularDescuentoFidelidad = (subtotal, aplicaDescuento, porcentaje) => {
    return aplicaDescuento ? (subtotal * porcentaje / 100) : 0;
};


export const calcularIGV = (subtotal, descuentoFidelidad) => {
    const subtotalConDescuento = subtotal - descuentoFidelidad;
    return subtotalConDescuento * 0.18;
};


export const calcularTotal = (subtotal, igv, descuentoFidelidad) => {
    const subtotalConDescuento = subtotal - descuentoFidelidad;
    return subtotalConDescuento + igv;
};


export const calcularVenta = (productos, aplicaDescuentoFidelidad, porcentajeDescuentoFidelidad) => {
    const subtotal = calcularSubtotal(productos);
    const descuentoProductos = calcularDescuentoProductos(productos);
    const descuentoFidelidad = calcularDescuentoFidelidad(subtotal, aplicaDescuentoFidelidad, porcentajeDescuentoFidelidad);
    const igv = calcularIGV(subtotal, descuentoFidelidad);
    const total = calcularTotal(subtotal, igv, descuentoFidelidad);

    return {
        subtotal,
        descuentoProductos,
        descuentoFidelidad,
        igv,
        total
    };
};
