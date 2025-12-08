# SIVI - Sistema de Inventario y Ventas Integrado

Sistema web para la gestión integral de un minimarket, desarrollado con React + Vite, que incluye gestión de ventas, inventario, compras, usuarios, reportes y asistente de chat con IA.

## 🚀 Tecnologías

### Frontend
- **React 19.1.1** - Librería UI con componentes funcionales
- **Vite 7.1.7** - Build tool de última generación
- **Tailwind CSS 4.1.13** - Framework CSS utility-first
- **React Router DOM 7.9.2** - Enrutamiento SPA

### HTTP y Autenticación
- **Axios 1.13.2** - Cliente HTTP
- **JWT Decode 4.0.0** - Decodificación de tokens JWT
- **httpClient** personalizado con interceptores

### Generación de Documentos
- **jsPDF 3.0.4** - Generación de PDFs
- **jspdf-autotable 5.0.2** - Tablas en PDFs

### UI/UX
- **Lucide React 0.544.0** - Iconos SVG optimizados
- **PostCSS 8.5.6** - Procesamiento CSS

### Desarrollo
- **ESLint 9.36.0** - Linter de código
- **Vite Plugin React 5.0.3** - Soporte JSX y HMR

---

## ⚡ Inicio Rápido

```bash
# 1. Clonar repositorio
git clone https://github.com/NbdyKnows/SIVI_FRONT.git
cd SIVI_FRONT

# 2. Instalar dependencias
npm install

# 3. Configurar modo (opcional - por defecto es DEVELOPMENT)
# Editar src/config/appConfig.js línea 10:
# export const APP_MODE = 'LOCAL';  // Para desarrollo sin backend

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador: http://localhost:5173
# Usuario: admin | Contraseña: admin123
```

**Nota**: En modo `LOCAL` no necesitas backend, todos los datos se guardan en localStorage.

---

## 📋 Tabla de Contenidos

1. [Instalación y Configuración](#-instalación-y-configuración)
2. [Requisitos del Sistema](#️-requisitos-del-sistema)
3. [Sistema de Autenticación JWT](#-sistema-de-autenticación-jwt)
4. [Configuración de API y Endpoints](#-configuración-de-api-y-endpoints)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Arquitectura y Funcionamiento](#️-arquitectura-y-funcionamiento)
7. [Base de Datos (JSON)](#-base-de-datos-json)
8. [Gestión de Estado y Contextos](#-gestión-de-estado-y-contextos)
9. [Añadir Nuevas Funcionalidades](#-añadir-nuevas-funcionalidades)
10. [Páginas del Sistema](#-páginas-del-sistema)
11. [Buenas Prácticas](#-buenas-prácticas)
12. [Contexto para IA](#-contexto-para-ia-chatgpt-claude-copilot)
13. [Solución de Problemas](#-solución-de-problemas-comunes)
14. [Características Principales](#-características-principales-del-sistema)

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

### Configurar Modo de Operación

El sistema **NO requiere archivo `.env`**. Todo se configura desde un único archivo:

Editar `src/config/appConfig.js` (línea 10):

```javascript
export const APP_MODE = 'DEVELOPMENT'; // Cambiar a 'LOCAL' o 'PRODUCTION'
```

**Modos disponibles:**
- **LOCAL**: Sin backend, usa base de datos JSON local
- **DEVELOPMENT**: Backend en desarrollo (http://localhost:8084/api)
- **PRODUCTION**: Backend en producción

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
| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **react** | ^19.1.1 | Librería principal para la UI |
| **react-dom** | ^19.1.1 | Renderizado de React en el DOM |
| **react-router-dom** | ^7.9.2 | Enrutamiento y navegación |
| **tailwindcss** | ^4.1.13 | Framework CSS utility-first |
| **lucide-react** | ^0.544.0 | Iconos SVG optimizados |
| **axios** | ^1.13.2 | Cliente HTTP para peticiones |
| **jwt-decode** | ^4.0.0 | Decodificación de tokens JWT |
| **jspdf** | ^3.0.4 | Generación de PDFs |
| **jspdf-autotable** | ^5.0.2 | Tablas automáticas en PDFs |
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
| Modo | Descripción | Backend | Uso |
|------|-------------|---------|-----|
| **LOCAL** | Sin backend, usa JSON local | ❌ No | Desarrollo frontend puro |
| **DEVELOPMENT** | Backend local | ✅ http://localhost:8084 | Desarrollo full-stack |
| **PRODUCTION** | Backend desplegado | ✅ Servidor producción | Aplicación en vivo |

### Configuración del Modo

Editar `src/config/appConfig.js`:

```javascript
// Línea 10
export const APP_MODE = 'DEVELOPMENT'; // Cambiar a 'LOCAL' o 'PRODUCTION'
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

### Chat Assistant con IA

El sistema incluye un asistente de chat ("Roblecito") que usa IA para responder preguntas:

- **Modo LOCAL**: Chat no disponible (requiere backend)
- **Modo DEVELOPMENT/PRODUCTION**: Conecta con el endpoint `/api/chat` del backend
- **Autenticación**: Requiere token JWT válido
- **Componente**: `src/components/ChatAssistant.jsx`
- **Servicio**: `src/services/ChatIA.js`

---

## 🌐 Configuración de API y Endpoints

### 📌 Cambiar Modo de Operación (LOCAL, DEVELOPMENT, PRODUCTION)

**Solo edita 1 archivo**: `src/config/appConfig.js`

```javascript
// Línea 13 - ÚNICO LUGAR para cambiar el modo
export const APP_MODE = 'DEVELOPMENT'; // Cambiar a 'LOCAL' o 'PRODUCTION'
```

Ver: `src/config/README.md` para más detalles.

---

### 🚀 Endpoints Disponibles

El sistema incluye servicios completos para todas las operaciones:

| Módulo | Servicio | Endpoints |
|--------|----------|-----------|
| **Autenticación** | `authService.js` | `/api/auth/login`, `/api/auth/refresh` |
| **Productos** | `productosService.js` | `/api/productos/*` |
| **Ventas** | `ventasService.js` | `/api/ventas/*` |
| **Compras** | `comprasService.js` | `/api/compras/*` |
| **Inventario** | `inventarioService.js` | `/api/inventario/*` |
| **Clientes** | `clientesService.js` | `/api/clientes/*` |
| **Proveedores** | `proveedoresService.js` | `/api/proveedores/*` |
| **Categorías** | `categoriasService.js` | `/api/categorias/*` |
| **Descuentos** | `descuentosService.js` | `/api/descuentos/*` |
| **Ofertas** | `ofertasService.js` | `/api/ofertas/*` |
| **Usuarios** | `usuariosService.js` | `/api/usuarios/*` |
| **Reportes** | `reportesService.js` | `/api/reportes/*` |
| **Caja Chica** | `cajaChicaService.js` | `/api/caja-chica/*` |
| **Movimientos** | `movimientosService.js` | `/api/movimientos/*` |
| **Chat IA** | `ChatIA.js` | `/api/chat` |

Todos los endpoints están centralizados en `src/config/endpoints/`

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
✅ **Timeouts ajustables**: Según el modo (LOCAL/DEV/PROD)  
✅ **Configuración simple**: Solo cambias `APP_MODE` en un lugar  
✅ **Arquitectura modular**: Servicios y endpoints separados por funcionalidad  
✅ **15+ servicios completos**: Listos para usar en cualquier componente  

---

### 📚 Documentación Relacionada

- **Configuración completa**: `src/config/README.md`
- **Arquitectura del sistema**: Ver sección "Arquitectura y Funcionamiento"
- **Manuales**: `src/data/manual_sistema.txt` y `manual_usuario.txt`

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
│   │   ├── appConfig.js      # Configuración principal del modo (LOCAL/DEV/PROD)
│   │   ├── apiConfig.js      # Re-exporta configuración de appConfig
│   │   ├── api.js            # Exportación centralizada de endpoints
│   │   ├── README.md         # Documentación del módulo de configuración
│   │   └── endpoints/        # Definición de endpoints por módulo
│   │       ├── authEndpoints.js
│   │       ├── productosEndpoints.js
│   │       ├── ventasEndpoints.js
│   │       ├── comprasEndpoints.js
│   │       ├── inventarioEndpoints.js
│   │       ├── clientesEndpoints.js
│   │       ├── proveedoresEndpoints.js
│   │       ├── categoriasEndpoints.js
│   │       ├── descuentosEndpoints.js
│   │       ├── ofertasEndpoints.js
│   │       ├── reportesEndpoints.js
│   │       ├── usuariosEndpoints.js
│   │       ├── cajaChicaEndpoints.js
│   │       └── movimientosEndpoints.js
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── modales/          # Modales del sistema
│   │   │   ├── index.js
│   │   │   ├── ModalAgregarProveedor.jsx
│   │   │   ├── ModalCategorias.jsx
│   │   │   ├── ModalCliente.jsx
│   │   │   ├── ModalCrearUsuario.jsx
│   │   │   ├── ModalDescuento.jsx
│   │   │   ├── ModalEditarUsuario.jsx
│   │   │   ├── ModalEstablecerContrasenia.jsx
│   │   │   ├── ModalInventario.jsx
│   │   │   ├── ModalNuevaCompra.jsx
│   │   │   ├── ModalOlvideContrasenia.jsx
│   │   │   ├── ModalProveedor.jsx
│   │   │   ├── ModalReporteFinanciero.jsx
│   │   │   ├── ModalReporteInventario.jsx
│   │   │   ├── ModalReporteVentas.jsx
│   │   │   ├── ModalSelectorProductos.jsx
│   │   │   └── ModalVenta.jsx
│   │   ├── BusquedaProductos.jsx
│   │   ├── ChatAssistant.jsx    # Asistente de chat con IA
│   │   ├── ComprobantePago.jsx
│   │   ├── EjemploUsoAPI.jsx
│   │   ├── FiltrosFecha.jsx
│   │   ├── Layout.jsx           # Layout principal con sidebar
│   │   ├── Login.jsx
│   │   ├── PaginacionTabla.jsx
│   │   ├── PaginacionVentas.jsx
│   │   ├── ProtectedRoute.jsx   # Protección de rutas
│   │   ├── PublicRoute.jsx
│   │   ├── Sidebar.jsx          # Menú lateral de navegación
│   │   ├── TablaProductos.jsx
│   │   └── Toast.jsx
│   │
│   ├── contexts/             # Context API de React
│   │   └── AuthContext.jsx   # Gestión de autenticación y permisos
│   │
│   ├── data/                 # Base de datos simulada y manuales
│   │   ├── database.json     # Datos en JSON (usuarios, productos, ventas, etc.)
│   │   ├── manual_sistema.txt   # Manual técnico del sistema
│   │   └── manual_usuario.txt   # Manual de usuario
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── useDatabase.js    # Hook para operaciones CRUD con database.json
│   │   └── ventas/           # Hooks específicos de ventas
│   │
│   ├── services/             # ⭐ Servicios y lógica de negocio
│   │   ├── index.js          # Exportación centralizada de servicios
│   │   ├── httpClient.js     # Cliente HTTP con manejo de errores y tokens
│   │   ├── authService.js    # Servicio de autenticación
│   │   ├── productosService.js
│   │   ├── ventasService.js
│   │   ├── comprasService.js
│   │   ├── inventarioService.js
│   │   ├── clientesService.js
│   │   ├── proveedoresService.js
│   │   ├── categoriasService.js
│   │   ├── descuentosService.js
│   │   ├── ofertasService.js
│   │   ├── tipoOfertaService.js
│   │   ├── usuariosService.js
│   │   ├── reportesService.js
│   │   ├── cajaChicaService.js
│   │   ├── movimientosService.js
│   │   └── ChatIA.js          # Servicio de chat con IA
│   │
│   ├── pages/                # Páginas principales del sistema
│   │   ├── index.js          # Exportación centralizada de páginas
│   │   ├── Ventas.jsx
│   │   ├── Compras.jsx
│   │   ├── Productos.jsx
│   │   ├── Descuentos.jsx
│   │   ├── Inventario.jsx
│   │   ├── AgregarStock.jsx
│   │   ├── Reportes.jsx
│   │   ├── Usuarios.jsx
│   │   ├── CajaChica.jsx
│   │   └── Movimiento.jsx
│   │
│   ├── styles/               # Estilos y configuraciones de diseño
│   │   └── colors.js         # Paleta de colores del sistema
│   │
│   ├── utils/                # Utilidades y helpers
│   │   ├── generarTicketPDF.js
│   │   └── ventasCalculos.js
│   │
│   ├── App.jsx               # Componente raíz con rutas
│   ├── main.jsx              # Punto de entrada de la aplicación
│   └── index.css             # Estilos globales y Tailwind
│
├── eslint.config.js          # Configuración de ESLint
├── postcss.config.js         # Configuración de PostCSS
├── tailwind.config.js        # Configuración de Tailwind CSS
├── vite.config.js            # Configuración de Vite
├── .env.example              # ⭐ Plantilla de variables de entorno (opcional)
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

### ⭐ Módulos Principales

**Configuración (`src/config/`)**
- Centraliza URLs y endpoints de la API
- Sistema modular con archivos separados por funcionalidad
- Un solo lugar para cambiar entre LOCAL/DEVELOPMENT/PRODUCTION

**Servicios (`src/services/`)**
- Capa de abstracción para comunicación con el backend
- `httpClient.js` maneja automáticamente tokens JWT y errores
- Servicios completos para todos los módulos del sistema

**Páginas (`src/pages/`)**
- 10 módulos principales: Ventas, Compras, Productos, Descuentos, Inventario, AgregarStock, Reportes, Usuarios, CajaChica, Movimiento

**Componentes (`src/components/`)**
- 15+ modales reutilizables para diferentes operaciones
- Componentes de UI comunes (tablas, paginación, búsqueda, filtros)
- Layout y navegación (Sidebar, ProtectedRoute, PublicRoute)

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

### Paso 4: Actualizar database.json

Agregar tabla inicial en `src/data/database.json`:

```json
{
  "usuarios": [...],
  "productos": [...],
  "misDatos": []
}
```

---

## 📱 Páginas del Sistema

### Páginas Disponibles

| Ruta | Componente | Descripción | Permisos |
|------|------------|-------------|----------|
| `/app/ventas` | `Ventas.jsx` | Punto de venta (POS) y historial | ventas |
| `/app/caja-chica` | `CajaChica.jsx` | Gestión de caja chica | admin |
| `/app/compras` | `Compras.jsx` | Registro de compras | compras |
| `/app/productos` | `Productos.jsx` | Gestión de productos | inventario |
| `/app/productos/descuentos` | `Descuentos.jsx` | Gestión de descuentos | inventario |
| `/app/inventario` | `Inventario.jsx` | Control de inventario | inventario |
| `/app/inventario/agregar-stock` | `AgregarStock.jsx` | Agregar stock a productos | inventario |
| `/app/movimiento` | `Movimiento.jsx` | Movimientos de caja | admin |
| `/app/reportes` | `Reportes.jsx` | Reportes del sistema | reportes |
| `/app/usuarios` | `Usuarios.jsx` | Gestión de usuarios | admin |

### Componentes Modales (15+)

Los modales son componentes reutilizables para operaciones CRUD:

- `ModalVenta` - Registrar nueva venta
- `ModalNuevaCompra` - Registrar compra
- `ModalSelectorProductos` - Selector de productos para ventas
- `ModalCliente` - Gestión de clientes
- `ModalProveedor` - Gestión de proveedores
- `ModalAgregarProveedor` - Crear nuevo proveedor
- `ModalCategorias` - Gestión de categorías
- `ModalDescuento` - Crear/editar descuentos
- `ModalInventario` - Ajustes de inventario
- `ModalCrearUsuario` - Crear nuevo usuario
- `ModalEditarUsuario` - Editar usuario existente
- `ModalEstablecerContrasenia` - Cambiar contraseña
- `ModalOlvideContrasenia` - Recuperar contraseña
- `ModalReporteVentas` - Configurar reporte de ventas
- `ModalReporteFinanciero` - Configurar reporte financiero
- `ModalReporteInventario` - Configurar reporte de inventario

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
Este es SIVI - Sistema de Inventario y Ventas Integrado para minimarket.

Stack Tecnológico:
- React 19.1.1 + Vite 7.1.7
- Tailwind CSS 4.1.13
- React Router DOM 7.9.2
- Axios 1.13.2 para peticiones HTTP
- JWT para autenticación
- jsPDF para generación de reportes

Arquitectura:
- Context API (AuthContext) para autenticación global
- Custom Hook (useDatabase) para operaciones CRUD en modo LOCAL
- Servicios modulares (15+ servicios) para comunicación con backend
- httpClient centralizado con manejo automático de tokens JWT
- Componentes funcionales con hooks
- Rutas protegidas por permisos basados en roles

Modos de Operación:
1. LOCAL: Sin backend, datos en localStorage (database.json)
2. DEVELOPMENT: Backend en http://localhost:8084/api
3. PRODUCTION: Backend en servidor de producción

Módulos del Sistema:
- Ventas (POS)
- Compras
- Inventario
- Productos y Descuentos
- Reportes (Ventas, Financieros, Inventario)
- Usuarios y Permisos
- Caja Chica
- Movimientos de Caja
- Chat Assistant con IA (Roblecito)

Todos los servicios están en src/services/ y endpoints en src/config/endpoints/
```

### Ejemplo de Prompt Efectivo

```
Necesito agregar una funcionalidad de "Gestión de Proveedores" con historial de compras en SIVI.

Requisitos:
1. Crear endpoint en src/config/endpoints/proveedoresEndpoints.js
2. Crear servicio en src/services/proveedoresService.js con operaciones CRUD
3. Página Proveedores.jsx que muestre:
   - Tabla de proveedores con búsqueda
   - Modal para crear/editar (RUC, razón social, contacto, teléfono, email)
   - Historial de compras por proveedor
4. Botones para editar, eliminar y ver historial
5. Seguir la misma estructura y estilos que Productos.jsx

Tecnologías: React 19, Tailwind CSS 4, Axios, React Router DOM 7
Contexto del proyecto: [Pegar este README completo]
```

---

## 🐛 Solución de Problemas Comunes

### El proyecto no inicia

```powershell
# En PowerShell - Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm run dev
```

O en bash/terminal Unix:

```bash
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

Este proyecto es de uso académico para el Curso Integrador I - UTP.

---

**Última actualización**: Diciembre 2024 - v1.0

---

## 🎯 Características Principales del Sistema

### Módulo de Ventas (POS)
- Registro rápido de ventas con selector de productos
- Búsqueda de productos por código o nombre
- Cálculo automático de totales, descuentos e IGV
- Generación de comprobantes en PDF
- Historial de ventas con paginación y filtros por fecha

### Módulo de Inventario
- Control de stock en tiempo real
- Alertas de stock mínimo
- Registro de entradas y salidas
- Gestión de productos (CRUD completo)
- Categorización de productos

### Módulo de Compras
- Registro de compras a proveedores
- Actualización automática de inventario
- Generación de órdenes de compra
- Historial de compras con filtros

### Módulo de Reportes
- Reportes de ventas por período
- Reportes financieros
- Reportes de inventario
- Exportación a PDF con jsPDF
- Tablas automáticas con jspdf-autotable

### Sistema de Usuarios y Permisos
- Roles: Admin, Cajero, Inventario
- Permisos granulares por módulo
- Autenticación JWT
- Gestión de usuarios (crear, editar, desactivar)

### Caja Chica
- Registro de ingresos y egresos
- Control de gastos operativos
- Historial de movimientos

### Chat Assistant (Roblecito)
- Asistente virtual con IA
- Respuestas sobre el sistema
- Requiere backend con integración de IA
