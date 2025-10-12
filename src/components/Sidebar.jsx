import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ShoppingCart,
  ShoppingBag,
  Package,
  FileText,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Percent,
  LogOut,
  DollarSign,
  Warehouse,
  PackagePlus
} from 'lucide-react';

/**
 * Elementos del menú sidebar
 */
const menuItems = [
  {
    id: 'ventas',
    label: 'Ventas',
    icon: ShoppingCart,
    path: '/app/ventas',
    permission: 'ventas'
  },
  {
    id: 'caja-chica',
    label: 'Caja Chica',
    icon: DollarSign,
    path: '/app/caja-chica',
    permission: 'caja-chica'
  },
  {
    id: 'compras',
    label: 'Compras',
    icon: ShoppingBag,
    path: '/app/compras',
    permission: 'compras'
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: Package,
    path: '/app/productos',
    permission: 'productos',
    hasSubmenu: true,
    submenu: [
      {
        id: 'descuentos',
        label: 'Descuentos',
        icon: Percent,
        path: '/app/productos/descuentos',
        permission: 'descuentos'
      }
    ]
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: Warehouse,
    path: '/app/inventario',
    permission: 'inventario',
    hasSubmenu: true,
    submenu: [
      {
        id: 'agregar-stock',
        label: 'Agregar Stock',
        icon: PackagePlus,
        path: '/app/inventario/agregar-stock',
        permission: 'agregar-stock'
      }
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: FileText,
    path: '/app/reportes',
    permission: 'reportes'
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: Users,
    path: '/app/usuarios',
    permission: 'usuarios'
  },
];

/**
 * Componente Sidebar - Para el sistema de minimarket
 */
const Sidebar = ({ isOpen = true, isCollapsed = false, onClose, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleItemClick = (item) => {
    // Siempre navegar a la página principal del elemento
    navigate(item.path);
    if (onClose) onClose(); // Cerrar sidebar en móviles
    
    // Si tiene submenú, también manejar la expansión/colapso
    if (item.hasSubmenu) {
      setExpandedMenus(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    }
  };

  const handleSubmenuClick = (submenuItem) => {
    navigate(submenuItem.path);
    if (onClose) onClose(); // Cerrar sidebar en móviles
  };

  const isItemActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubmenuActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtrar elementos del menú según permisos
  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative left-0 top-0 z-40
          transform transition-all duration-300 ease-in-out 
          bg-white shadow-lg border-r border-gray-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-16' : 'w-64'}
          h-full flex flex-col
        `}
      >
        {/* Header del sidebar */}
        <div className="border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-center h-16 px-4">
            {!isCollapsed && (
              <h2 className="text-lg lg:text-xl font-bold text-center" style={{ color: '#3F7416' }}>
                Minimarket Los Robles
              </h2>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3F7416' }}>
                <span className="text-white font-bold text-sm">MR</span>
              </div>
            )}
          </div>
          
          {/* User Info */}
          {!isCollapsed && user && (
            <div className="px-3 lg:px-4 pb-4">
              <div className="bg-green-50 rounded-lg p-2 lg:p-3 border border-green-100">
                <p className="text-xs lg:text-sm font-semibold text-green-800 truncate">{user.name}</p>
                <p className="text-xs text-green-600 capitalize">{user.role}</p>
                <p className="text-xs text-green-500">ID: {user.id}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col py-4 px-3 min-h-0">
          {/* Toggle Button - Sobresaliendo hacia afuera */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute top-20 -right-3 z-50 p-2 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {/* Menu Items - Con scroll solo cuando NO está colapsado */}
          <div className={`flex-1 ${isCollapsed ? '' : 'overflow-y-auto'}`}>
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isItemActive(item.path);
                const isExpanded = expandedMenus[item.id];
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`
                        w-full flex items-center rounded-lg text-left transition-all duration-200 group relative
                        ${isCollapsed ? 'justify-center px-3 py-3' : 'justify-between px-4 py-3'}
                        ${
                          isActive
                            ? 'bg-green-50 shadow-sm border border-green-100'
                            : 'hover:bg-gray-50 hover:shadow-sm'
                        }
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                        <IconComponent 
                          className="w-6 h-6 flex-shrink-0" 
                          style={{ color: '#633416' }}
                        />
                        {!isCollapsed && (
                          <span 
                            className="font-medium whitespace-nowrap text-base"
                            style={{ color: '#3F7416' }}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                      
                      {!isCollapsed && item.hasSubmenu && (
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" style={{ color: '#633416' }} />
                          ) : (
                            <ChevronRight className="w-4 h-4" style={{ color: '#633416' }} />
                          )}
                        </div>
                      )}
                      
                      {/* Tooltip para modo colapsado */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                          {item.label}
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                        </div>
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {item.hasSubmenu && isExpanded && !isCollapsed && (
                      <ul className="mt-2 ml-6 space-y-1">
                        {item.submenu.filter(submenuItem => hasPermission(submenuItem.permission)).map((submenuItem) => {
                          const SubmenuIcon = submenuItem.icon;
                          const isSubmenuItemActive = isSubmenuActive(submenuItem.path);
                          
                          return (
                            <li key={submenuItem.id}>
                              <button
                                onClick={() => handleSubmenuClick(submenuItem)}
                                className={`
                                  w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200
                                  ${
                                    isSubmenuItemActive
                                      ? 'bg-green-100 shadow-sm'
                                      : 'hover:bg-gray-50'
                                  }
                                `}
                              >
                                <SubmenuIcon 
                                  className="w-5 h-5 flex-shrink-0" 
                                  style={{ color: '#633416' }}
                                />
                                <span 
                                  className="font-medium text-sm"
                                  style={{ color: '#3F7416' }}
                                >
                                  {submenuItem.label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Botón de Logout - Al final del sidebar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center rounded-lg text-left transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                hover:bg-red-50 hover:shadow-sm border border-transparent hover:border-red-100
              `}
              title={isCollapsed ? 'Cerrar Sesión' : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <LogOut 
                  className="w-6 h-6 flex-shrink-0 text-red-600" 
                />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap text-base text-red-600">
                    Cerrar Sesión
                  </span>
                )}
              </div>
              
              {/* Tooltip para modo colapsado */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Cerrar Sesión
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;