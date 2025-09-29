import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatAssistant from './ChatAssistant';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Detectar cambios de anchura de la ventana
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      
      // Si cambia de desktop a tablet/móvil (< 1024px), colapsar sidebar
      if (windowWidth >= 1024 && newWidth < 1024) {
        setSidebarCollapsed(true);
      }
      // Si cambia de tablet/móvil a desktop (>= 1024px), expandir sidebar
      else if (windowWidth < 1024 && newWidth >= 1024) {
        setSidebarCollapsed(false);
      }
      // En móvil muy pequeño (< 768px), cerrar sidebar completamente
      if (newWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
      // En tablet/desktop, abrir sidebar si estaba cerrado
      else if (newWidth >= 768 && !sidebarOpen) {
        setSidebarOpen(true);
      }
      
      setWindowWidth(newWidth);
    };

    // Configuración inicial basada en el tamaño de pantalla
    const initialWidth = window.innerWidth;
    if (initialWidth < 1024) {
      setSidebarCollapsed(true);
    }
    if (initialWidth < 768) {
      setSidebarOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth, sidebarOpen]);

  // Función para manejar el cierre del sidebar (especialmente en móviles)
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Función para alternar el colapso del sidebar
  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={handleCloseSidebar}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - Solo visible en móviles */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
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