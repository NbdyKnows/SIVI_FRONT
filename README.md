# SIVI - Sistema de Inventario y Ventas Integrado

Sistema web para la gestión integral de un minimarket, desarrollado con React + Vite, que incluye gestión de ventas, inventario, compras, usuarios y reportes.

---

## 📋 Tabla de Contenidos

1. [Instalación y Configuración](#-instalación-y-configuración)
2. [Requisitos del Sistema](#-requisitos-del-sistema)
3. [Sistema de Autenticación JWT](#-sistema-de-autenticación-jwt)
4. [Configuración de API](#-configuración-de-api)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Arquitectura y Funcionamiento](#-arquitectura-y-funcionamiento)
7. [Base de Datos (JSON)](#-base-de-datos-json)
8. [Gestión de Estado y Contextos](#-gestión-de-estado-y-contextos)
9. [Añadir Nuevas Funcionalidades](#-añadir-nuevas-funcionalidades)
10. [Buenas Prácticas](#-buenas-prácticas)

---

## 🚀 Instalación y Configuración

### Clonar el Repositorio

```bash
git clone https://github.com/NbdyKnows/SIVI_FRONT.git
cd SIVI_FRONT
```

### Instalar Dependencias

```bash
npm install
```

### Configurar Variables de Entorno

Copiar el archivo de ejemplo y configurar las URLs:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# URL del backend en desarrollo (local)
VITE_API_BASE_URL_DEV=http://localhost:3000

# URL del backend en producción
VITE_API_BASE_URL_PROD=https://api.minimarket-losrobles.com

# API Key de Groq (para el chat assistant)
VITE_GROQ_API_KEY=tu_clave_aqui
```

### Ejecutar el Proyecto en Desarrollo

```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:5173` (o el puerto que Vite asigne automáticamente).

### Construir para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Vista Previa de Producción

```bash
npm run preview
```

---

## 🛠️ Requisitos del Sistema

### Versiones Recomendadas

- **Node.js**: `v18.0.0` o superior (recomendado: `v20.x`)
- **npm**: `v9.0.0` o superior
- **Navegadores compatibles**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)

### Dependencias Principales

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **react** | ^19.1.1 | Librería principal para la UI |
| **react-dom** | ^19.1.1 | Renderizado de React en el DOM |
| **react-router-dom** | ^7.9.2 | Enrutamiento y navegación |
| **tailwindcss** | ^4.1.13 | Framework CSS utility-first |
| **lucide-react** | ^0.544.0 | Iconos SVG optimizados |
| **vite** | ^7.1.7 | Build tool y dev server ultrarrápido |

### Verificar Versión de Node

```bash
node --version
npm --version
```

Si necesitas instalar o actualizar Node.js, visita: https://nodejs.org/

---

## 🔐 Sistema de Autenticación JWT

### Modos de Operación

El sistema soporta **3 modos de desarrollo**:

| Modo | Descripción | Backend | Uso |
|------|-------------|---------|-----|
| **LOCAL** | Sin backend, usa JSON local | ❌ No | Desarrollo frontend puro |
| **DEVELOPMENT** | Backend local | ✅ http://localhost:8083 | Desarrollo full-stack |
| **PRODUCTION** | Backend desplegado | ✅ Servidor producción | Aplicación en vivo |

### Configuración del Modo

Editar `src/services/authService.js`:

```javascript
// Línea 21
const AUTH_MODE = 'LOCAL'; // Cambiar a 'DEVELOPMENT' o 'PRODUCTION'
```

### Usuarios de Prueba (Modo LOCAL)

```javascript
// Admin - Acceso total
Usuario: admin
Contraseña: admin123

// Cajero - Ventas y caja
Usuario: vendedor
Contraseña: vendedor123

// Inventario - Productos e inventario
Usuario: inventario
Contraseña: inventario123
```

### Uso en Componentes

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, login, logout, hasPermission } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login({
      id: 'admin',
      password: 'admin123'
    });
    
    if (result.success) {
      console.log('Usuario:', result.user);
    }
  };

  // Verificar permisos
  if (hasPermission('ventas')) {
    // Mostrar módulo de ventas
  }

  // Logout
  const handleLogout = () => logout();
};
```

### Estructura del Token JWT

```javascript
{
  sub: "admin",           // Username
  idUsuario: 1,           // ID del usuario
  nombre: "Juan Pérez",   // Nombre completo
  rol: "ADMIN",           // ADMIN, CAJA, ALMACEN
  idRol: 1,               // ID del rol
  habilitado: true,       // Estado activo
  iss: "SIVI",            // Emisor
  iat: 1640000000,        // Timestamp emisión
  exp: 1640086400         // Timestamp expiración (24h)
}
```

### Documentación Completa

Para más detalles, ver: `src/services/README_AUTH.md`

---

## 🌐 Configuración de API y Endpoints

### 📌 Cambiar Modo de Operación (LOCAL, DEVELOPMENT, PRODUCTION)

**Solo edita 1 archivo**: `src/config/appConfig.js`

```javascript
// Línea 13 - ÚNICO LUGAR para cambiar el modo
export const APP_MODE = 'DEVELOPMENT'; // Cambiar a 'LOCAL' o 'PRODUCTION'
```

Ver: `CAMBIAR_MODO.md` para más detalles.

---

### 🚀 Cómo Agregar y Usar Endpoints

#### **Paso 1: Crear el archivo de endpoints**

Crear `src/config/endpoints/productosEndpoints.js`:

```javascript
import { API_BASE_URL } from '../appConfig';

export const productosEndpoints = {
  base: `${API_BASE_URL}/api/productos`,
  getAll: `${API_BASE_URL}/api/productos`,
  getById: (id) => `${API_BASE_URL}/api/productos/${id}`,
  create: `${API_BASE_URL}/api/productos`,
  update: (id) => `${API_BASE_URL}/api/productos/${id}`,
  delete: (id) => `${API_BASE_URL}/api/productos/${id}`,
  search: `${API_BASE_URL}/api/productos/search`,
};
```

#### **Paso 2: Exportar en `api.js`**

Editar `src/config/api.js`:

```javascript
// Agregar exportación
export { productosEndpoints } from './endpoints/productosEndpoints';

// Agregar al objeto API_ENDPOINTS
import { productosEndpoints } from './endpoints/productosEndpoints';

export const API_ENDPOINTS = {
  // ... otros endpoints
  productos: productosEndpoints,
};
```

#### **Paso 3: Crear el servicio (opcional pero recomendado)**

Crear `src/services/productosService.js`:

```javascript
import httpClient from './httpClient';
import { productosEndpoints } from '../config/api';

const productosService = {
  async getAll() {
    return await httpClient.get(productosEndpoints.getAll);
  },
  
  async getById(id) {
    return await httpClient.get(productosEndpoints.getById(id));
  },
  
  async create(producto) {
    return await httpClient.post(productosEndpoints.create, producto);
  },
  
  async update(id, producto) {
    return await httpClient.put(productosEndpoints.update(id), producto);
  },
  
  async delete(id) {
    return await httpClient.delete(productosEndpoints.delete(id));
  }
};

export default productosService;
```

#### **Paso 4: Usar en componentes**

```javascript
import { productosService } from '../services';

// En tu componente
const MiComponente = () => {
  const [productos, setProductos] = useState([]);
  
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await productosService.getAll();
        setProductos(data);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    
    cargarProductos();
  }, []);
  
  const crearProducto = async (nuevoProducto) => {
    try {
      await productosService.create(nuevoProducto);
      // Recargar lista
      const data = await productosService.getAll();
      setProductos(data);
    } catch (error) {
      alert('Error al crear producto');
    }
  };
  
  return (/* Tu JSX */);
};
```

---

### ✨ Ventajas del Sistema

✅ **Token automático**: `httpClient` agrega el token JWT automáticamente en cada petición  
✅ **Manejo de errores**: Errores capturados y formateados automáticamente  
✅ **Timeouts**: Ajustados según el modo (LOCAL/DEV/PROD)  
✅ **Sin configuración extra**: Solo cambias `APP_MODE` en un lugar  

---

### 📚 Documentación Completa

- **Configuración completa**: `src/config/README.md`
- **Cambiar modos**: `CAMBIAR_MODO.md`
- **Arquitectura**: `ARQUITECTURA_CONFIGURACION.txt`

---

## 📁 Estructura del Proyecto

```
SIVI/
├── public/                    # Archivos estáticos públicos
│   └── vite.svg              # Favicon y recursos públicos
├── src/
│   ├── assets/               # Imágenes y recursos multimedia
│   │   ├── login.png
│   │   ├── logo.png
│   │   └── roblecito.png
│   │
│   ├── config/               # ⭐ Configuración de API y constantes
│   │   ├── api.js           # URLs base y endpoints de la API
│   │   └── README.md        # Documentación del módulo de configuración
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── modales/         # Modales del sistema
│   │   │   ├── ModalAgregarProveedor.jsx
│   │   │   ├── ModalCliente.jsx
│   │   │   ├── ModalDescuento.jsx
│   │   │   ├── ModalInventario.jsx
│   │   │   ├── ModalProveedor.jsx
│   │   │   ├── ModalSelectorProductos.jsx
│   │   │   └── ModalVenta.jsx
│   │   ├── BusquedaProductos.jsx
│   │   ├── ChatAssistant.jsx
│   │   ├── ComprobantePago.jsx
│   │   ├── FiltrosFecha.jsx
│   │   ├── Layout.jsx          # Layout principal con sidebar
│   │   ├── Login.jsx
│   │   ├── PaginacionTabla.jsx
│   │   ├── PaginacionVentas.jsx
│   │   ├── ProtectedRoute.jsx  # Protección de rutas
│   │   ├── PublicRoute.jsx
│   │   ├── Sidebar.jsx         # Menú lateral de navegación
│   │   └── TablaProductos.jsx
│   │
│   ├── contexts/             # Context API de React
│   │   └── AuthContext.jsx   # Gestión de autenticación y permisos
│   │
│   ├── data/                 # Base de datos simulada
│   │   └── database.json     # Datos en JSON (usuarios, productos, ventas, etc.)
│   │
│   ├── hooks/                # Custom Hooks
│   │   └── useDatabase.js    # Hook para operaciones CRUD con database.json
│   │
│   ├── services/             # ⭐ Servicios y lógica de negocio
│   │   ├── httpClient.js    # Cliente HTTP con manejo de errores
│   │   ├── productosService.js # Ejemplo de servicio para productos
│   │   ├── ChatIA.js        # Servicio de chat con IA
│   │   └── index.js         # Exportación centralizada de servicios
│   │
│   ├── pages/                # Páginas principales del sistema
│   │   ├── AgregarStock.jsx
│   │   ├── CajaChica.jsx
│   │   ├── Compras.jsx
│   │   ├── Descuentos.jsx
│   │   ├── Inventario.jsx
│   │   ├── Productos.jsx
│   │   ├── Reportes.jsx
│   │   ├── Usuarios.jsx
│   │   ├── Ventas.jsx
│   │   └── index.js          # Exportación centralizada de páginas
│   │
│   ├── styles/               # Estilos y configuraciones de diseño
│   │   └── colors.js         # Paleta de colores del sistema
│   │
│   ├── App.jsx               # Componente raíz con rutas
│   ├── main.jsx              # Punto de entrada de la aplicación
│   └── index.css             # Estilos globales y Tailwind
│
├── eslint.config.js          # Configuración de ESLint
├── postcss.config.js         # Configuración de PostCSS
├── tailwind.config.js        # Configuración de Tailwind CSS
├── vite.config.js            # Configuración de Vite
├── .env                      # ⭐ Variables de entorno (NO subir a Git)
├── .env.example              # ⭐ Plantilla de variables de entorno
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

### ⭐ Archivos Nuevos (Configuración API)

Los archivos marcados con ⭐ son parte del nuevo módulo de configuración de API:

- **`src/config/api.js`**: Centraliza todas las URLs y endpoints
- **`src/services/httpClient.js`**: Cliente HTTP reutilizable con timeout y manejo de errores
- **`src/services/productosService.js`**: Ejemplo de servicio completo
- **`.env`**: Variables de entorno (desarrollo y producción)
- **`.env.example`**: Plantilla para configurar tu propio `.env`

---

## 🏗️ Arquitectura y Funcionamiento

### Flujo de la Aplicación

```
Usuario accede → Login.jsx (autenticación)
                    ↓
            AuthContext valida credenciales
                    ↓
        ProtectedRoute verifica permisos
                    ↓
            Layout.jsx (estructura base)
                    ↓
        Sidebar.jsx + Página específica (Ventas, Inventario, etc.)
                    ↓
        Componentes usan useDatabase() para leer/escribir datos
                    ↓
            database.json se actualiza en localStorage
```

### Comunicación entre Componentes

#### 1. **Context API (AuthContext)**
- **Propósito**: Gestionar autenticación y permisos globalmente
- **Ubicación**: `src/contexts/AuthContext.jsx`
- **Datos que provee**:
  - `user`: Usuario autenticado actual
  - `login(username, password)`: Función para iniciar sesión
  - `logout()`: Cerrar sesión
  - `hasPermission(permission)`: Verificar si el usuario tiene un permiso específico

**Ejemplo de uso:**
```jsx
import { useAuth } from '../contexts/AuthContext';

function MiComponente() {
  const { user, hasPermission, logout } = useAuth();
  
  if (!hasPermission('ventas')) {
    return <div>No tienes acceso</div>;
  }
  
  return <div>Bienvenido {user.name}</div>;
}
```

#### 2. **Custom Hook (useDatabase)**
- **Propósito**: Operaciones CRUD con la base de datos JSON
- **Ubicación**: `src/hooks/useDatabase.js`
- **Funciones disponibles**:
  - `getProductos()`: Obtener todos los productos
  - `getProductoById(id)`: Obtener un producto específico
  - `createProducto(producto)`: Crear nuevo producto
  - `updateProducto(id, producto)`: Actualizar producto existente
  - `deleteProducto(id)`: Eliminar producto
  - (Métodos similares para ventas, compras, usuarios, proveedores, etc.)

**Ejemplo de uso:**
```jsx
import useDatabase from '../hooks/useDatabase';

function ListaProductos() {
  const { getProductos, deleteProducto } = useDatabase();
  const productos = getProductos();
  
  const handleEliminar = (id) => {
    if (confirm('¿Eliminar producto?')) {
      deleteProducto(id);
      // El componente se re-renderiza automáticamente
    }
  };
  
  return (
    <ul>
      {productos.map(prod => (
        <li key={prod.id}>
          {prod.nombre}
          <button onClick={() => handleEliminar(prod.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}
```

#### 3. **Props Drilling**
Para componentes anidados se pasan props directamente:

```jsx
// Página padre
<ModalVenta 
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onGuardar={handleGuardarVenta}
/>
```

#### 4. **React Router (Navegación)**
- **Ubicación**: `src/App.jsx`
- **Componentes clave**:
  - `BrowserRouter`: Envuelve toda la app
  - `Routes` y `Route`: Define las rutas
  - `ProtectedRoute`: Protege rutas privadas
  - `PublicRoute`: Rutas solo para usuarios no autenticados
  - `Outlet`: Renderiza rutas hijas en Layout

**Ejemplo de navegación:**
```jsx
import { useNavigate } from 'react-router-dom';

function MiComponente() {
  const navigate = useNavigate();
  
  const irAProductos = () => {
    navigate('/app/productos');
  };
  
  return <button onClick={irAProductos}>Ver Productos</button>;
}
```

---

## 💾 Base de Datos (JSON)

### Ubicación
`src/data/database.json`

### Funcionamiento

El sistema utiliza **localStorage** como base de datos persistente:

1. **Inicialización**: Al cargar la app, `useDatabase` verifica si existe data en `localStorage`
2. **Si NO existe**: Carga `database.json` inicial y lo guarda en `localStorage`
3. **Si existe**: Usa los datos de `localStorage` (datos persistentes entre sesiones)

### Estructura de database.json

```json
{
  "usuarios": [
    {
      "id": "USER001",
      "username": "admin",
      "password": "admin123",
      "name": "Administrador Principal",
      "role": "admin",
      "active": true,
      "permissions": ["ventas", "compras", "inventario", "reportes", "usuarios"]
    }
  ],
  "productos": [
    {
      "id": "PROD001",
      "codigo": "7750182000123",
      "nombre": "Inca Kola 1.5L",
      "categoria": "Bebidas",
      "precio": 5.50,
      "stock": 48,
      "stockMinimo": 10,
      "proveedor": "PROV001",
      "activo": true
    }
  ],
  "ventas": [...],
  "compras": [...],
  "proveedores": [...],
  "cajaChica": [...],
  "descuentos": [...]
}
```

### Operaciones CRUD

Todas las operaciones usan `useDatabase`:

```jsx
const { 
  getProductos,      // READ
  createProducto,    // CREATE
  updateProducto,    // UPDATE
  deleteProducto     // DELETE
} = useDatabase();
```

### Resetear Base de Datos

Si necesitas volver a los datos iniciales:

```javascript
// En la consola del navegador
localStorage.removeItem('minimarket_db');
// Luego recargar la página
```

---

## 🔐 Gestión de Estado y Contextos

### AuthContext

**Responsabilidades:**
- Validar credenciales de usuario
- Mantener sesión activa (persistencia en localStorage)
- Verificar permisos basados en roles
- Proteger rutas según permisos

**Roles del sistema:**
| Rol | Permisos |
|-----|----------|
| **admin** | Acceso total (ventas, compras, inventario, reportes, usuarios) |
| **vendedor** | ventas, consulta de productos |
| **encargado_inventario** | inventario, compras, consulta de productos |
| **contador** | reportes, caja chica, consulta general |

**Agregar nuevos permisos:**

1. Modificar el usuario en `database.json`:
```json
{
  "permissions": ["ventas", "compras", "nuevo_permiso"]
}
```

2. Proteger rutas en `App.jsx`:
```jsx
<Route 
  path="/app/nueva-funcionalidad" 
  element={
    <ProtectedRoute requiredPermission="nuevo_permiso">
      <NuevaFuncionalidad />
    </ProtectedRoute>
  } 
/>
```

3. Agregar item en `Sidebar.jsx`:
```jsx
{
  id: 'nueva-funcionalidad',
  label: 'Nueva Funcionalidad',
  icon: IconComponent,
  path: '/app/nueva-funcionalidad',
  permission: 'nuevo_permiso'
}
```

---

## ➕ Añadir Nuevas Funcionalidades

### Paso 1: Crear la Página

Crear archivo en `src/pages/MiFuncionalidad.jsx`:

```jsx
import React, { useState } from 'react';
import useDatabase from '../hooks/useDatabase';

const MiFuncionalidad = () => {
  const { getMisDatos, createMiDato } = useDatabase();
  const [datos, setDatos] = useState(getMisDatos());

  const handleCrear = (nuevoDato) => {
    createMiDato(nuevoDato);
    setDatos(getMisDatos());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Funcionalidad</h1>
      {/* Tu contenido aquí */}
    </div>
  );
};

export default MiFuncionalidad;
```

### Paso 2: Exportar en index.js

Editar `src/pages/index.js`:

```javascript
export { default as MiFuncionalidad } from './MiFuncionalidad';
```

### Paso 3: Agregar Ruta

Editar `src/App.jsx`:

```jsx
import { MiFuncionalidad } from './pages';

// Dentro de <Routes>
<Route 
  path="/app/mi-funcionalidad" 
  element={
    <ProtectedRoute requiredPermission="mi_permiso">
      <MiFuncionalidad />
    </ProtectedRoute>
  } 
/>
```

### Paso 4: Agregar al Sidebar

Editar `src/components/Sidebar.jsx`:

```javascript
import { MiIcono } from 'lucide-react';

const menuItems = [
  // ... otros items
  {
    id: 'mi-funcionalidad',
    label: 'Mi Funcionalidad',
    icon: MiIcono,
    path: '/app/mi-funcionalidad',
    permission: 'mi_permiso'
  }
];
```

### Paso 5: Extender useDatabase (si necesitas nuevas tablas)

Editar `src/hooks/useDatabase.js`:

```javascript
// Agregar getter
const getMisDatos = () => {
  const db = getDatabase();
  return db.misDatos || [];
};

// Agregar CRUD
const createMiDato = (dato) => {
  const db = getDatabase();
  if (!db.misDatos) db.misDatos = [];
  
  const nuevoId = `MIDATO${String(db.misDatos.length + 1).padStart(3, '0')}`;
  const nuevoDato = { id: nuevoId, ...dato };
  
  db.misDatos.push(nuevoDato);
  saveDatabase(db);
  return nuevoDato;
};

// Exportar
return {
  // ... otros métodos
  getMisDatos,
  createMiDato,
  // ... más métodos CRUD
};
```

### Paso 6: Actualizar database.json

Agregar tabla inicial en `src/data/database.json`:

```json
{
  "usuarios": [...],
  "productos": [...],
  "misDatos": []
}
```

---

## ✅ Buenas Prácticas

### Componentes

- **Un componente = Una responsabilidad**
- **Nombres descriptivos**: `ModalCrearUsuario.jsx` mejor que `Modal.jsx`
- **Reutilización**: Si un código se repite más de 2 veces, crear componente

### Estilos

- **Tailwind CSS**: Usar clases utilitarias preferentemente
- **Colores del sistema**: Importar de `src/styles/colors.js`
- **Responsive**: Usar breakpoints de Tailwind (`sm:`, `md:`, `lg:`, `xl:`)

```jsx
// ✅ Correcto
import { COLORS } from '../styles/colors';

<button 
  className="px-4 py-2 rounded-lg hover:opacity-90 lg:px-6"
  style={{ backgroundColor: COLORS.primary }}
>
  Guardar
</button>
```

### Gestión de Estado

- **Estado local**: Usar `useState` para datos del componente
- **Estado global**: Usar `AuthContext` solo para autenticación
- **Persistencia**: Usar `useDatabase` para datos que deben guardarse

### IDs Únicos

- Formato: `PREFIJO + número con padding`
- Ejemplos: `USER001`, `PROD042`, `VENTA123`

```javascript
const nuevoId = `PROD${String(productos.length + 1).padStart(3, '0')}`;
// Genera: PROD001, PROD002, ... PROD999
```

### Validaciones

- **Siempre validar** antes de guardar datos
- **Mensajes claros** de error
- **Confirmar acciones destructivas** (eliminar, etc.)

```javascript
const handleEliminar = (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  
  deleteProducto(id);
  alert('Producto eliminado exitosamente');
};
```

### Performance

- **Evitar renders innecesarios**: Usar `React.memo` para componentes pesados
- **Lazy loading**: Importar páginas con `React.lazy()` si crecen mucho
- **Optimizar imágenes**: Comprimir antes de agregar a `src/assets/`

---

## 📝 Contexto para IA (ChatGPT, Claude, Copilot)

Si trabajas con una IA para desarrollar nuevas features, **comparte este README completo** y añade:

### Información del Sistema

```
Este es un sistema de gestión para minimarket desarrollado con:
- React 19 + Vite 7
- Tailwind CSS 4
- React Router DOM 7
- Base de datos en JSON simulada con localStorage

Arquitectura:
- Context API para autenticación (AuthContext)
- Custom Hook useDatabase para operaciones CRUD
- Componentes funcionales con hooks
- Rutas protegidas por permisos

La aplicación NO tiene backend, todo es frontend con persistencia en localStorage.
```

### Ejemplo de Prompt Efectivo

```
Necesito agregar una funcionalidad de "Gestión de Clientes" en SIVI.

Requisitos:
1. Crear página Clientes.jsx que muestre tabla de clientes
2. Modal para crear/editar clientes (nombre, DNI, teléfono, email)
3. Botones para editar y eliminar
4. Búsqueda por nombre o DNI
5. Seguir la misma estructura y estilos que Usuarios.jsx

Contexto del proyecto: [Pegar este README completo]
```

---

## 🐛 Solución de Problemas Comunes

### El proyecto no inicia

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Cambios no se reflejan

- **Hard refresh**: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
- **Limpiar caché de Vite**: Eliminar carpeta `.vite/` y reiniciar

### localStorage corrupto

```javascript
// En consola del navegador
localStorage.clear();
location.reload();
```

### Permisos no funcionan

Verificar que el usuario tenga el permiso en `database.json` o localStorage:

```javascript
// En consola
const db = JSON.parse(localStorage.getItem('minimarket_db'));
console.log(db.usuarios);
```

---

## 📞 Contacto y Contribución

Para dudas, bugs o sugerencias:
- **Repositorio**: [github.com/NbdyKnows/SIVI_FRONT](https://github.com/NbdyKnows/SIVI_FRONT)
- **Issues**: Crear un issue en GitHub con descripción detallada

---

## 📄 Licencia

Este proyecto es de uso privado para el Minimarket Los Robles.

---

**Última actualización**: Octubre 2025
