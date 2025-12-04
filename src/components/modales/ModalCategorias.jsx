import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Tag, Edit2, Trash2, Plus } from 'lucide-react';
import categoriasService from '../../services/categoriasService';

const ModalCategorias = ({ isOpen, onClose, onCategoriaCreada }) => {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  // Cargar categorías
  useEffect(() => {
    if (isOpen) {
      cargarCategorias();
    }
  }, [isOpen]);

  const cargarCategorias = async () => {
    setIsLoading(true);
    try {
      const data = await categoriasService.getAll();
      setCategorias(data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    
    if (!nuevaCategoria.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const nuevaCat = await categoriasService.create({
        descripcion: nuevaCategoria.trim()
      });
      
      setCategorias([...categorias, nuevaCat]);
      setNuevaCategoria('');
      
      if (onCategoriaCreada) {
        onCategoriaCreada(nuevaCat);
      }
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setError('Error al crear la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditarCategoria = async (id, nuevaDescripcion) => {
    if (!nuevaDescripcion.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const categoriaActualizada = await categoriasService.update(id, {
        descripcion: nuevaDescripcion.trim()
      });
      
      setCategorias(categorias.map(cat => 
        cat.idCat === id ? categoriaActualizada : cat
      ));
      setEditando(null);
      
      if (onCategoriaCreada) {
        onCategoriaCreada(categoriaActualizada);
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      setError('Error al actualizar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminarCategoria = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await categoriasService.delete(id);
      setCategorias(categorias.filter(cat => cat.idCat !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setError('Error al eliminar la categoría. Puede que tenga productos asociados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNuevaCategoria('');
    setEditando(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F0F8E8' }}>
              <Tag className="w-5 h-5" style={{ color: '#3F7416' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: '#3F7416' }}>
              Gestionar Categorías
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Formulario Nueva Categoría */}
          <form onSubmit={handleCrearCategoria} className="space-y-3">
            <label className="block text-sm font-medium" style={{ color: '#666666' }}>
              Nueva Categoría
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Lácteos"
                disabled={isLoading}
                maxLength={50}
              />
              <button
                type="submit"
                disabled={isLoading || !nuevaCategoria.trim()}
                className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: '#3F7416' }}
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </form>

          {/* Lista de Categorías */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Categorías Existentes ({categorias.length})
            </h3>
            
            {isLoading && categorias.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando categorías...</p>
              </div>
            ) : categorias.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No hay categorías registradas</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categorias.map(categoria => (
                  <div
                    key={categoria.idCat}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {editando === categoria.idCat ? (
                      <input
                        type="text"
                        defaultValue={categoria.descripcion}
                        onBlur={(e) => handleEditarCategoria(categoria.idCat, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEditarCategoria(categoria.idCat, e.target.value);
                          }
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                        disabled={isLoading}
                      />
                    ) : (
                      <span className="flex-1 font-medium text-gray-900">
                        {categoria.descripcion}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditando(categoria.idCat)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        disabled={isLoading}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEliminarCategoria(categoria.idCat)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        disabled={isLoading}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#3F7416' }}
            disabled={isLoading}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCategorias;
