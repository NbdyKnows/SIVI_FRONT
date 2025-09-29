import { useState } from 'react';
import databaseData from '../data/database.json';

/**
 * Hook personalizado para gestionar los datos de la base de datos simulada
 * Mantiene la integridad referencial y estructura de la BD
 */
export const useDatabase = () => {
  const [data, setData] = useState(databaseData);

  // Función para obtener datos con joins
  const getProductosWithCategoria = () => {
    return data.producto
      .filter(p => p.habilitado)
      .map(producto => {
        const categoria = data.producto_cat.find(cat => cat.id_cat === producto.id_cat);
        return {
          ...producto,
          categoria: categoria?.descripcion || 'Sin categoría'
        };
      });
  };

  const getInventarioWithProductoAndCategoria = () => {
    return data.inventario
      .filter(inv => inv.habilitado)
      .map(inventario => {
        const producto = data.producto.find(p => p.id_producto === inventario.id_producto);
        const categoria = data.producto_cat.find(cat => cat.id_cat === producto?.id_cat);
        const movimiento = data.movimiento_cab.find(mov => mov.id_movimiento_cab === inventario.id_movimiento_cab);
        
        return {
          ...inventario,
          producto: producto?.descripcion || 'Producto no encontrado',
          categoria: categoria?.descripcion || 'Sin categoría',
          fecha_movimiento: movimiento?.fecha || null,
          sku: `P${String(producto?.id_producto || 0).padStart(3, '0')}`
        };
      });
  };

  const getUsuariosWithRol = () => {
    return data.usuario
      .filter(u => u.habilitado)
      .map(usuario => {
        const rol = data.rol.find(r => r.id_rol === usuario.id_rol);
        return {
          ...usuario,
          rol_descripcion: rol?.descripcion || 'Sin rol'
        };
      });
  };

  const getProveedoresActivos = () => {
    return data.proveedor.filter(p => p.habilitado);
  };

  const getCategorias = () => {
    return data.producto_cat;
  };

  const getOfertasWithTipo = () => {
    return data.oferta.map(oferta => {
      const tipoOferta = data.tipo_oferta.find(tipo => tipo.id_tipo_oferta === oferta.id_tipo_oferta);
      const producto = data.producto.find(p => p.id_producto === oferta.id);
      
      return {
        ...oferta,
        tipo_descripcion: tipoOferta?.descripcion || 'Sin tipo',
        producto_descripcion: producto?.descripcion || 'General'
      };
    });
  };

  const getComprobantesWithDetalles = () => {
    return data.comprobante_cab
      .filter(comp => comp.habilitado)
      .map(comprobante => {
        const usuario = data.usuario.find(u => u.id_usuario === comprobante.id_usuario);
        const cliente = data.cliente.find(c => c.id_cliente === comprobante.id_cliente);
        const detalles = data.comprobante_det
          .filter(det => det.id_cab_boleta === comprobante.id_comprobante_cab)
          .map(detalle => {
            const producto = data.producto.find(p => p.id_producto === detalle.id_producto);
            const oferta = detalle.id_oferta ? 
              data.oferta.find(o => o.id_oferta === detalle.id_oferta) : null;
            
            return {
              ...detalle,
              producto_descripcion: producto?.descripcion || 'Producto no encontrado',
              oferta_descripcion: oferta?.descripcion || null
            };
          });

        return {
          ...comprobante,
          usuario_nombre: usuario?.nombre || 'Usuario no encontrado',
          cliente_nombre: cliente?.Nombres || 'Cliente no encontrado',
          detalles
        };
      });
  };

  // Funciones para agregar nuevos registros
  const addProducto = (productoData) => {
    const newId = Math.max(...data.producto.map(p => p.id_producto)) + 1;
    const newProducto = {
      id_producto: newId,
      ...productoData,
      habilitado: true
    };
    
    setData(prevData => ({
      ...prevData,
      producto: [...prevData.producto, newProducto]
    }));
    
    return newProducto;
  };

  const addMovimiento = (movimientoCabData, movimientoDetData) => {
    const newCabId = Math.max(...data.movimiento_cab.map(m => m.id_movimiento_cab)) + 1;
    const newDetId = Math.max(...data.movimiento_det.map(m => m.id_det_movimiento)) + 1;
    
    const newMovimientoCab = {
      id_movimiento_cab: newCabId,
      ...movimientoCabData,
      habilitado: true
    };
    
    const newMovimientoDet = {
      id_det_movimiento: newDetId,
      id_cab_movimiento: newCabId,
      ...movimientoDetData,
      habilitado: true
    };

    setData(prevData => ({
      ...prevData,
      movimiento_cab: [...prevData.movimiento_cab, newMovimientoCab],
      movimiento_det: [...prevData.movimiento_det, newMovimientoDet]
    }));

    // Actualizar inventario
    updateInventario(movimientoDetData.id_producto, newCabId, movimientoDetData.cantidad, movimientoDetData.precio);
    
    return { movimientoCab: newMovimientoCab, movimientoDet: newMovimientoDet };
  };

  const updateInventario = (idProducto, idMovimientoCab, cantidad, precio) => {
    setData(prevData => {
      const existingInventario = prevData.inventario.find(
        inv => inv.id_producto === idProducto && inv.habilitado
      );

      if (existingInventario) {
        // Actualizar inventario existente
        return {
          ...prevData,
          inventario: prevData.inventario.map(inv =>
            inv.id_inventario === existingInventario.id_inventario
              ? {
                  ...inv,
                  stock: inv.stock + cantidad,
                  precio: precio,
                  id_movimiento_cab: idMovimientoCab
                }
              : inv
          )
        };
      } else {
        // Crear nuevo registro de inventario
        const newInventarioId = Math.max(...prevData.inventario.map(i => i.id_inventario)) + 1;
        const newInventario = {
          id_inventario: newInventarioId,
          id_movimiento_cab: idMovimientoCab,
          id_producto: idProducto,
          stock: cantidad,
          precio: precio,
          habilitado: true
        };

        return {
          ...prevData,
          inventario: [...prevData.inventario, newInventario]
        };
      }
    });
  };

  const updateProducto = (idProducto, productoData) => {
    setData(prevData => ({
      ...prevData,
      producto: prevData.producto.map(producto =>
        producto.id_producto === idProducto
          ? { ...producto, ...productoData }
          : producto
      )
    }));
  };

  const deleteProducto = (idProducto) => {
    setData(prevData => ({
      ...prevData,
      producto: prevData.producto.map(producto =>
        producto.id_producto === idProducto
          ? { ...producto, habilitado: false }
          : producto
      )
    }));
  };

  // Funciones para usuarios
  const createUsuario = (datosUsuario) => {
    const nuevoId = generateNextId('usuario');
    const nuevoUsuario = {
      id_usuario: nuevoId,
      nombre: datosUsuario.nombre,
      usuario: datosUsuario.usuario,
      contrasenia: datosUsuario.contrasenia || '', // Contraseña temporal
      id_rol: datosUsuario.id_rol,
      fecha_registro: new Date().toISOString(),
      habilitado: true,
      reset: datosUsuario.reset || true // Por defecto necesita establecer contraseña
    };

    setData(prevData => ({
      ...prevData,
      usuario: [...prevData.usuario, nuevoUsuario]
    }));

    return nuevoUsuario;
  };

  const updateUsuario = (usuario, datosActualizados) => {
    setData(prevData => ({
      ...prevData,
      usuario: prevData.usuario.map(u =>
        u.usuario === usuario
          ? { ...u, ...datosActualizados }
          : u
      )
    }));
  };

  const generateNextId = (tableName) => {
    const table = data[tableName];
    if (!table || table.length === 0) return 1;
    const idField = `id_${tableName === 'producto_cat' ? 'cat' : tableName.split('_')[0]}`;
    return Math.max(...table.map(item => item[idField] || 0)) + 1;
  };

  return {
    // Datos brutos
    data,
    
    // Consultas con joins
    getProductosWithCategoria,
    getInventarioWithProductoAndCategoria,
    getUsuariosWithRol,
    getProveedoresActivos,
    getCategorias,
    getOfertasWithTipo,
    getComprobantesWithDetalles,
    
    // Operaciones CRUD
    addProducto,
    addMovimiento,
    updateInventario,
    updateProducto,
    deleteProducto,
    createUsuario,
    updateUsuario,
    
    // Utilidades
    generateNextId
  };
};

export default useDatabase;