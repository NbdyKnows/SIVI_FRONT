import { useState, useEffect } from 'react';
import productosService from '../../services/productosService';
import inventarioService from '../../services/inventarioService';
import ventasService from '../../services/ventasService';

/**
 * Custom Hook para gestión de productos en ventas
 * 
 * Maneja la carga, búsqueda y aplicación de descuentos a productos
 * 
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} database - Base de datos local (fallback)
 * @returns {Object} Estado y funciones para gestión de productos
 */
export const useProductos = (searchTerm, database) => {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [productosConDescuento, setProductosConDescuento] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Función para aplicar descuentos a productos usando el endpoint
    const aplicarDescuentosAProductos = async (productos) => {
        try {
            const productosParaCalculo = productos.map(p => ({
                id_producto: p.idProducto || p.id_producto,
                id_categoria: p.id_cat,
                cantidad: 1,
                precio_unitario: p.precio_venta
            }));

            const resultado = await ventasService.calcularDescuentos({
                productos: productosParaCalculo
            });

            console.log('💰 Descuentos calculados:', resultado);

            return productos.map((producto, index) => {
                const productoConDescuento = resultado.productos[index];
                const ofertaAplicada = productoConDescuento?.oferta_aplicada;

                return {
                    ...producto,
                    descuento: ofertaAplicada ? {
                        id_oferta: ofertaAplicada.id_oferta,
                        nombre: ofertaAplicada.descripcion,
                        tipo: ofertaAplicada.tipo,
                        tipo_descuento: 'porcentaje'
                    } : null,
                    descuento_valor: ofertaAplicada?.descuento_porcentaje || 0,
                    precio_con_descuento: ofertaAplicada
                        ? producto.precio_venta * (1 - ofertaAplicada.descuento_porcentaje / 100)
                        : producto.precio_venta
                };
            });
        } catch (error) {
            console.error('❌ Error al calcular descuentos:', error);
            return productos.map(p => ({
                ...p,
                descuento: null,
                descuento_valor: 0,
                precio_con_descuento: p.precio_venta
            }));
        }
    };

    // Cargar descuentos en background sin bloquear la UI
    const aplicarDescuentosEnBackground = async (productos) => {
        try {
            console.log('🔄 Cargando descuentos en background...');
            const productosConDesc = await aplicarDescuentosAProductos(productos);
            setProductosDisponibles(productosConDesc);
            setProductosConDescuento(productosConDesc);
            console.log('✅ Descuentos aplicados');
        } catch (error) {
            console.warn('⚠️ Error al cargar descuentos, continuando sin ellos:', error);
        }
    };

    // Cargar productos desde la API
    const cargarProductosDesdeAPI = async () => {
        setIsLoadingProducts(true);
        try {
            const [productos, inventario] = await Promise.all([
                productosService.getAll(),
                inventarioService.getAll()
            ]);

            console.log('📦 Productos cargados:', productos);
            console.log('📊 Inventario cargado:', inventario);

            const inventarioMap = {};
            inventario.forEach(inv => {
                if (inv.habilitado) {
                    inventarioMap[inv.idProducto] = inv;
                }
            });

            const productosFormateados = productos
                .filter(p => p.habilitado)
                .map(producto => {
                    const inv = inventarioMap[producto.idProducto];

                    if (!inv || !inv.stock || inv.stock <= 0) {
                        return null;
                    }

                    return {
                        id_producto: producto.idProducto,
                        idProducto: producto.idProducto,
                        nombre: producto.descripcion,
                        descripcion: producto.descripcion,
                        stock: inv.stock || 0,
                        precio_venta: inv.precio || 0,
                        codigo: producto.codigo || `P${String(producto.idProducto).padStart(3, '0')}`,
                        categoria: producto.categoria || 'Sin categoría',
                        id_cat: producto.idCat,
                        habilitado: true
                    };
                })
                .filter(p => p !== null);

            console.log('✅ Productos formateados:', productosFormateados);

            setProductosDisponibles(productosFormateados);
            setProductosConDescuento(productosFormateados);

            aplicarDescuentosEnBackground(productosFormateados);
        } catch (error) {
            console.error('❌ Error al cargar productos desde API:', error);
            console.warn('⚠️ Usando productos del JSON local como fallback');
            cargarProductosDesdeJSON();
        } finally {
            setIsLoadingProducts(false);
        }
    };

    // Fallback: Cargar productos desde JSON local
    const cargarProductosDesdeJSON = async () => {
        if (!database?.producto) return;

        const productos = database.producto.filter(p => p.habilitado).map(producto => {
            const inventario = database?.inventario?.find(inv => inv.id_producto === producto.id_producto && inv.habilitado);
            const categoria = database?.producto_cat?.find(c => c.id_cat === producto.id_cat);
            return {
                id_producto: producto.id_producto,
                idProducto: producto.id_producto,
                stock: inventario?.stock || 0,
                precio_venta: inventario?.precio || 0,
                codigo: `P${String(producto.id_producto).padStart(3, '0')}`,
                nombre: producto.descripcion,
                descripcion: producto.descripcion,
                categoria: categoria?.descripcion || 'Sin categoría',
                habilitado: true
            };
        }).filter(p => p.stock > 0);

        const productosConDesc = await aplicarDescuentosAProductos(productos);
        setProductosDisponibles(productosConDesc);
        setProductosConDescuento(productosConDesc);
    };

    // Buscar productos con autocomplete (optimizado con búsqueda local primero)
    const buscarProductos = async (query) => {
        if (!query || query.trim().length < 1) {
            setProductosConDescuento(productosDisponibles);
            return;
        }

        // Primero intentar búsqueda local (más rápido)
        const resultadosLocales = productosDisponibles.filter(p =>
            p.nombre?.toLowerCase().includes(query.toLowerCase()) ||
            p.codigo?.toLowerCase().includes(query.toLowerCase()) ||
            p.categoria?.toLowerCase().includes(query.toLowerCase())
        );

        if (resultadosLocales.length > 0) {
            console.log('🔍 Búsqueda local:', resultadosLocales.length, 'resultados');
            setProductosConDescuento(resultadosLocales);
            return;
        }

        // Si no hay resultados locales, buscar en API
        try {
            console.log('🔍 Buscando en API:', query);
            const [resultados, inventario] = await Promise.all([
                productosService.search(query),
                inventarioService.getAll()
            ]);

            const inventarioMap = {};
            inventario.forEach(inv => {
                if (inv.habilitado) {
                    inventarioMap[inv.idProducto] = inv;
                }
            });

            const productosFormateados = resultados
                .filter(p => p.habilitado)
                .map(producto => {
                    const inv = inventarioMap[producto.idProducto];

                    if (!inv || !inv.stock || inv.stock <= 0) {
                        return null;
                    }

                    return {
                        id_producto: producto.idProducto,
                        idProducto: producto.idProducto,
                        nombre: producto.descripcion,
                        descripcion: producto.descripcion,
                        stock: inv.stock || 0,
                        precio_venta: inv.precio || 0,
                        codigo: producto.codigo || `P${String(producto.idProducto).padStart(3, '0')}`,
                        categoria: producto.categoria || 'Sin categoría',
                        id_cat: producto.idCat,
                        habilitado: true,
                        descuento: null,
                        descuento_valor: 0,
                        precio_con_descuento: inv.precio || 0
                    };
                })
                .filter(p => p !== null);

            setProductosConDescuento(productosFormateados);

            if (productosFormateados.length > 0) {
                aplicarDescuentosEnBackground(productosFormateados);
            }
        } catch (error) {
            console.error('❌ Error al buscar productos:', error);
            setProductosConDescuento([]);
        }
    };

    // Cargar productos al montar el hook
    useEffect(() => {
        cargarProductosDesdeAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Efecto para búsqueda con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                buscarProductos(searchTerm);
            } else {
                setProductosConDescuento(productosDisponibles);
            }
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return {
        productos: productosDisponibles,
        productosFiltrados: productosConDescuento,
        isLoading: isLoadingProducts,
        buscarProductos,
        recargarProductos: cargarProductosDesdeAPI
    };
};
