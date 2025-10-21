/**
 * EJEMPLO DE USO - Componente con API
 * 
 * Este archivo muestra cómo usar los servicios de API en un componente React.
 * Puedes copiar estos patrones para tus propios componentes.
 */

import React, { useState, useEffect } from 'react';
import { productosService } from '../services';
import { APIError } from '../services/httpClient';

const EjemploProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== OBTENER TODOS LOS PRODUCTOS ====================
  const cargarProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productosService.getAll();
      setProductos(data);
    } catch (err) {
      if (err instanceof APIError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError('Error de conexión. Verifica tu internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== CREAR PRODUCTO ====================
  const crearProducto = async (producto) => {
    setLoading(true);
    setError(null);

    try {
      const nuevoProducto = await productosService.create(producto);
      setProductos([...productos, nuevoProducto]);
      alert('Producto creado exitosamente');
    } catch (err) {
      if (err instanceof APIError) {
        alert(`Error: ${err.message}`);
      } else {
        alert('Error al crear producto');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== ACTUALIZAR PRODUCTO ====================
  const actualizarProducto = async (id, datosActualizados) => {
    setLoading(true);
    setError(null);

    try {
      const productoActualizado = await productosService.update(id, datosActualizados);
      setProductos(productos.map(p => p.id === id ? productoActualizado : p));
      alert('Producto actualizado exitosamente');
    } catch (err) {
      if (err instanceof APIError) {
        alert(`Error: ${err.message}`);
      } else {
        alert('Error al actualizar producto');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== ELIMINAR PRODUCTO ====================
  const eliminarProducto = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;

    setLoading(true);
    setError(null);

    try {
      await productosService.delete(id);
      setProductos(productos.filter(p => p.id !== id));
      alert('Producto eliminado exitosamente');
    } catch (err) {
      if (err instanceof APIError) {
        alert(`Error: ${err.message}`);
      } else {
        alert('Error al eliminar producto');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== BUSCAR PRODUCTOS ====================
  const buscarProductos = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const resultados = await productosService.search(query);
      setProductos(resultados);
    } catch (err) {
      if (err instanceof APIError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error en la búsqueda');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // ==================== RENDER ====================
  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
        <button 
          onClick={cargarProductos}
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {/* Botón para crear */}
      <button
        onClick={() => {
          const nuevoProducto = {
            nombre: 'Producto de prueba',
            precio: 10.50,
            categoria: 'Bebidas',
            stock: 100,
          };
          crearProducto(nuevoProducto);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Crear Producto de Prueba
      </button>

      {/* Lista de productos */}
      <div className="grid gap-4">
        {productos.map(producto => (
          <div key={producto.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{producto.nombre}</h3>
            <p>Precio: S/ {producto.precio}</p>
            <p>Stock: {producto.stock}</p>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => {
                  const datosActualizados = {
                    ...producto,
                    precio: producto.precio + 1,
                  };
                  actualizarProducto(producto.id, datosActualizados);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Aumentar Precio
              </button>

              <button
                onClick={() => eliminarProducto(producto.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EjemploProductos;
