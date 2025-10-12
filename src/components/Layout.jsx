import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatAssistant from './ChatAssistant';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detectar cambios de anchura de la ventana
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      
      // En móvil/tablet (< 1024px), cerrar sidebar por defecto
      if (newWidth < 1024) {
        setSidebarOpen(false);
        setSidebarCollapsed(false); // Expandido cuando se abre
      }
      // En desktop (>= 1024px), abrir y expandir sidebar
      else {
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    };

    // Configuración inicial basada en el tamaño de pantalla
    const initialWidth = window.innerWidth;
    if (initialWidth < 1024) {
      setSidebarOpen(false);
      setSidebarCollapsed(false);
    } else {
      setSidebarOpen(true);
      setSidebarCollapsed(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para manejar el cierre del sidebar (especialmente en móviles)
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Función para alternar el colapso del sidebar
  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={handleCloseSidebar}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content - Click fuera cierra sidebar en móvil */}
      <div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        onClick={() => {
          // Solo cerrar en móvil cuando sidebar está abierto
          if (window.innerWidth < 1024 && sidebarOpen) {
            handleCloseSidebar();
          }
        }}
      >
        {/* Mobile Header - Solo visible en móviles */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evitar que el click cierre el sidebar
              setSidebarOpen(true);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" style={{ color: '#3F7416' }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: '#3F7416' }}>
            Minimarket Los Robles
          </h1>
          <div className="w-10"></div> {/* Spacer para centrar el título */}
        </div>

        {/* Content Area */}
        <main 
          className="flex-1 overflow-auto p-4 sm:p-6"
          style={{ backgroundColor: '#F5F6F8' }}
        >
          <Outlet />
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};

export default Layout;