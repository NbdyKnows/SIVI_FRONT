# Módulo de Configuración API

Este módulo gestiona las URLs base y endpoints de la API para el sistema SIVI de forma organizada y modular.

## 🎯 CONFIGURACIÓN CENTRALIZADA

**⚠️ ¡IMPORTANTE! ⚠️**

Para cambiar el modo de la aplicación (LOCAL, DEVELOPMENT, PRODUCTION), **SOLO necesitas editar UN archivo**:

```javascript
// 📁 src/config/appConfig.js

export const APP_MODE = 'DEVELOPMENT'; // 👈 CAMBIA ESTE VALOR AQUÍ
```

### Modos Disponibles:

- **`'LOCAL'`**: Sin backend - Usa base de datos JSON en localStorage
- **`'DEVELOPMENT'`**: Backend local en desarrollo (`http://localhost:8083`)
- **`'PRODUCTION'`**: Backend desplegado en producción

**NO necesitas cambiar NADA más en el código**. Todo se configura automáticamente desde este único punto.

---

## 📁 Estructura de Archivos

```
src/config/
├── appConfig.js                    # ⭐ CONFIGURACIÓN CENTRAL (cambia el modo aquí)
├── apiConfig.js                    # Configuración base (re-exporta appConfig)
├── api.js                          # Índice central (exporta todo)
└── endpoints/                      # Endpoints organizados por módulo
    ├── authEndpoints.js           # Autenticación
    ├── productosEndpoints.js      # Productos
    ├── ventasEndpoints.js         # Ventas
    ├── comprasEndpoints.js        # Compras
    ├── inventarioEndpoints.js     # Inventario
    ├── usuariosEndpoints.js       # Usuarios
    ├── proveedoresEndpoints.js    # Proveedores
    ├── clientesEndpoints.js       # Clientes
    ├── descuentosEndpoints.js     # Descuentos
    ├── cajaChicaEndpoints.js      # Caja Chica
    └── reportesEndpoints.js       # Reportes
```

### Descripción de Archivos

- **`appConfig.js`**: ⭐ **PUNTO ÚNICO DE CONFIGURACIÓN**
  - Define el modo de la aplicación: `APP_MODE`
  - URLs según el modo (LOCAL/DEVELOPMENT/PRODUCTION)
  - Timeouts según el modo
  - Configuración de autenticación
  - **Es el ÚNICO lugar donde debes cambiar el modo**

- **`apiConfig.js`**: Re-exporta configuración de `appConfig.js`
  - Mantiene compatibilidad con código existente
  - No necesitas modificar este archivo

- **`api.js`**: Archivo índice central
  - Exporta todos los endpoints
  - Re-exporta configuración base
  - Punto único de importación

- **`endpoints/*.js`**: Un archivo por módulo
  - Cada archivo contiene solo los endpoints de su módulo
  - Fácil de mantener y extender
  - Organización clara y escalable

---

## � Gestión de Endpoints

### Estructura de Endpoints

Cada módulo de endpoints sigue esta estructura:

```javascript
// Ejemplo: productosEndpoints.js
import { API_BASE_URL } from '../apiConfig';

export const productosEndpoints = {
  base: `${API_BASE_URL}/api/productos`,
  getAll: `${API_BASE_URL}/api/productos`,
  getById: (id) => `${API_BASE_URL}/api/productos/${id}`,
  create: `${API_BASE_URL}/api/productos`,
  update: (id) => `${API_BASE_URL}/api/productos/${id}`,
  delete: (id) => `${API_BASE_URL}/api/productos/${id}`,
  search: `${API_BASE_URL}/api/productos/search`,
  byCategory: (categoria) => `${API_BASE_URL}/api/productos/categoria/${categoria}`,
};
```

### Opciones de Importación

#### **Opción 1: Importar módulo específico** (⭐ Recomendado)

```javascript
// Solo importas el módulo que necesitas
import { productosEndpoints } from '../config/api';

const url = productosEndpoints.getAll;
// http://localhost:3000/api/productos

const urlById = productosEndpoints.getById('PROD001');
// http://localhost:3000/api/productos/PROD001
```

#### **Opción 2: Importar todo como objeto**

```javascript
// Importas el objeto completo con todos los módulos
import { API_ENDPOINTS } from '../config/api';

const url = API_ENDPOINTS.productos.getAll;
const url2 = API_ENDPOINTS.ventas.create;
const url3 = API_ENDPOINTS.usuarios.getById('USER001');
```

#### **Opción 3: Importar directamente del archivo**

```javascript
// Vas directo al archivo del módulo específico
import { productosEndpoints } from '../config/endpoints/productosEndpoints';

const url = productosEndpoints.search;
```

### Endpoints Disponibles por Módulo

#### 🔐 Autenticación (`authEndpoints`)

```javascript
import { authEndpoints } from '../config/api';

authEndpoints.login           // POST /api/auth/login
authEndpoints.logout          // POST /api/auth/logout
authEndpoints.verify          // GET  /api/auth/verify
authEndpoints.changePassword  // POST /api/auth/change-password
authEndpoints.recoverPassword // POST /api/auth/recover-password
```

#### 📦 Productos (`productosEndpoints`)

```javascript
import { productosEndpoints } from '../config/api';

productosEndpoints.base                     // Base: /api/productos
productosEndpoints.getAll                   // GET    /api/productos
productosEndpoints.getById(id)              // GET    /api/productos/:id
productosEndpoints.create                   // POST   /api/productos
productosEndpoints.update(id)               // PUT    /api/productos/:id
productosEndpoints.delete(id)               // DELETE /api/productos/:id
productosEndpoints.search                   // GET    /api/productos/search
productosEndpoints.byCategory(categoria)    // GET    /api/productos/categoria/:categoria
```

#### 🛒 Ventas (`ventasEndpoints`)

```javascript
import { ventasEndpoints } from '../config/api';

ventasEndpoints.base                    // Base: /api/ventas
ventasEndpoints.getAll                  // GET    /api/ventas
ventasEndpoints.getById(id)             // GET    /api/ventas/:id
ventasEndpoints.create                  // POST   /api/ventas
ventasEndpoints.update(id)              // PUT    /api/ventas/:id
ventasEndpoints.delete(id)              // DELETE /api/ventas/:id
ventasEndpoints.byDate                  // GET    /api/ventas/fecha
ventasEndpoints.byVendedor(vendedorId)  // GET    /api/ventas/vendedor/:vendedorId
ventasEndpoints.statistics              // GET    /api/ventas/estadisticas
```

#### 🏪 Compras (`comprasEndpoints`)

```javascript
import { comprasEndpoints } from '../config/api';

comprasEndpoints.base                       // Base: /api/compras
comprasEndpoints.getAll                     // GET    /api/compras
comprasEndpoints.getById(id)                // GET    /api/compras/:id
comprasEndpoints.create                     // POST   /api/compras
comprasEndpoints.update(id)                 // PUT    /api/compras/:id
comprasEndpoints.delete(id)                 // DELETE /api/compras/:id
comprasEndpoints.byProveedor(proveedorId)   // GET    /api/compras/proveedor/:proveedorId
```

#### 📊 Inventario (`inventarioEndpoints`)

```javascript
import { inventarioEndpoints } from '../config/api';

inventarioEndpoints.base          // Base: /api/inventario
inventarioEndpoints.getAll        // GET  /api/inventario
inventarioEndpoints.getById(id)   // GET  /api/inventario/:id
inventarioEndpoints.update(id)    // PUT  /api/inventario/:id
inventarioEndpoints.agregarStock  // POST /api/inventario/agregar-stock
inventarioEndpoints.ajustarStock  // POST /api/inventario/ajustar-stock
inventarioEndpoints.bajoStock     // GET  /api/inventario/bajo-stock
```

#### 👥 Usuarios (`usuariosEndpoints`)

```javascript
import { usuariosEndpoints } from '../config/api';

usuariosEndpoints.base                // Base: /api/usuarios
usuariosEndpoints.getAll              // GET    /api/usuarios
usuariosEndpoints.getById(id)         // GET    /api/usuarios/:id
usuariosEndpoints.create              // POST   /api/usuarios
usuariosEndpoints.update(id)          // PUT    /api/usuarios/:id
usuariosEndpoints.delete(id)          // DELETE /api/usuarios/:id
usuariosEndpoints.updatePassword(id)  // PUT    /api/usuarios/:id/password
```

#### 🏢 Proveedores (`proveedoresEndpoints`)

```javascript
import { proveedoresEndpoints } from '../config/api';

proveedoresEndpoints.base         // Base: /api/proveedores
proveedoresEndpoints.getAll       // GET    /api/proveedores
proveedoresEndpoints.getById(id)  // GET    /api/proveedores/:id
proveedoresEndpoints.create       // POST   /api/proveedores
proveedoresEndpoints.update(id)   // PUT    /api/proveedores/:id
proveedoresEndpoints.delete(id)   // DELETE /api/proveedores/:id
```

#### 👤 Clientes (`clientesEndpoints`)

```javascript
import { clientesEndpoints } from '../config/api';

clientesEndpoints.base         // Base: /api/clientes
clientesEndpoints.getAll       // GET    /api/clientes
clientesEndpoints.getById(id)  // GET    /api/clientes/:id
clientesEndpoints.create       // POST   /api/clientes
clientesEndpoints.update(id)   // PUT    /api/clientes/:id
clientesEndpoints.delete(id)   // DELETE /api/clientes/:id
clientesEndpoints.search       // GET    /api/clientes/search
```

#### 💰 Descuentos (`descuentosEndpoints`)

```javascript
import { descuentosEndpoints } from '../config/api';

descuentosEndpoints.base         // Base: /api/descuentos
descuentosEndpoints.getAll       // GET    /api/descuentos
descuentosEndpoints.getById(id)  // GET    /api/descuentos/:id
descuentosEndpoints.create       // POST   /api/descuentos
descuentosEndpoints.update(id)   // PUT    /api/descuentos/:id
descuentosEndpoints.delete(id)   // DELETE /api/descuentos/:id
descuentosEndpoints.activos      // GET    /api/descuentos/activos
```

#### 💵 Caja Chica (`cajaChicaEndpoints`)

```javascript
import { cajaChicaEndpoints } from '../config/api';

cajaChicaEndpoints.base         // Base: /api/caja-chica
cajaChicaEndpoints.getAll       // GET    /api/caja-chica
cajaChicaEndpoints.getById(id)  // GET    /api/caja-chica/:id
cajaChicaEndpoints.create       // POST   /api/caja-chica
cajaChicaEndpoints.update(id)   // PUT    /api/caja-chica/:id
cajaChicaEndpoints.delete(id)   // DELETE /api/caja-chica/:id
cajaChicaEndpoints.balance      // GET    /api/caja-chica/balance
```

#### 📈 Reportes (`reportesEndpoints`)

```javascript
import { reportesEndpoints } from '../config/api';

reportesEndpoints.base        // Base: /api/reportes
reportesEndpoints.ventas      // GET  /api/reportes/ventas
reportesEndpoints.inventario  // GET  /api/reportes/inventario
reportesEndpoints.financiero  // GET  /api/reportes/financiero
reportesEndpoints.productos   // GET  /api/reportes/productos
reportesEndpoints.general     // GET  /api/reportes/general
```

---

## 🚀 Configuración Inicial

### 1. Cambiar el Modo de la Aplicación

**Edita `src/config/appConfig.js` y cambia `APP_MODE`:**

```javascript
// 📁 src/config/appConfig.js

// Modo LOCAL: Sin backend, usa localStorage
export const APP_MODE = 'LOCAL';

// Modo DEVELOPMENT: Backend local (http://localhost:8083)
export const APP_MODE = 'DEVELOPMENT';

// Modo PRODUCTION: Backend desplegado
export const APP_MODE = 'PRODUCTION';
```

### 2. Configurar variables de entorno (opcional para PRODUCTION)

Si usas modo PRODUCTION, crea un archivo `.env`:

```bash
cp .env.example .env
```

Y configura la URL de producción:

```env
# Producción (servidor desplegado)
VITE_API_BASE_URL_PROD=https://api.minimarket-losrobles.com/api

# API Key de Groq (para el chat)
VITE_GROQ_API_KEY=tu_clave_aqui
```

### 3. ¡Listo! 🎉

Todo lo demás se configura automáticamente:
- ✅ URLs de autenticación
- ✅ URLs de la API
- ✅ Timeouts
- ✅ httpClient
- ✅ authService

---

## 🔧 Uso en Componentes

### Importar servicios

```javascript
import { productosService } from '../services';
```

### Ejemplo: Obtener todos los productos

```javascript
import { productosService } from '../services';

async function obtenerProductos() {
  try {
    const productos = await productosService.getAll();
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}
```

### Ejemplo: Obtener un producto por ID

```javascript
import { productosService } from '../services';

async function obtenerProducto(id) {
  const producto = await productosService.getById(id);
  return producto;
}
```

### Ejemplo: Crear un nuevo producto

```javascript
import { productosService } from '../services';

async function crearProducto(nuevoProducto) {
  const producto = await productosService.create(nuevoProducto);
  return producto;
}
```

### Ejemplo: Buscar productos

```javascript
import { productosService } from '../services';

async function buscarProductos(query) {
  const resultados = await productosService.search(query);
  return resultados;
}
```

---

## 🌍 Modos de Operación

El sistema ahora funciona con **3 modos** configurables desde un **único punto**:

### 🔹 Modo LOCAL
```javascript
export const APP_MODE = 'LOCAL';
```
- **Sin backend**: Toda la data está en `localStorage`
- **Autenticación**: Con base de datos JSON local
- **Ideal para**: Desarrollo sin servidor, demos offline
- **URLs**: No se usan (todo es local)
- **Timeout**: 5 segundos

### 🔹 Modo DEVELOPMENT
```javascript
export const APP_MODE = 'DEVELOPMENT';
```
- **Backend local**: `http://localhost:8083/api`
- **Autenticación**: JWT real del backend
- **Ideal para**: Desarrollo con backend local
- **URLs**: Hardcodeadas para localhost:8083
- **Timeout**: 10 segundos
- **Logs**: Activos en consola

### 🔹 Modo PRODUCTION
```javascript
export const APP_MODE = 'PRODUCTION';
```
- **Backend desplegado**: URL desde `.env`
- **Autenticación**: JWT real del backend
- **Ideal para**: Producción, staging
- **URLs**: Desde `VITE_API_BASE_URL_PROD`
- **Timeout**: 15 segundos
- **Logs**: Desactivados

---

## 📋 Endpoints Disponibles

### Autenticación
- `API_ENDPOINTS.auth.login` - POST
- `API_ENDPOINTS.auth.logout` - POST
- `API_ENDPOINTS.auth.verify` - GET
- `API_ENDPOINTS.auth.changePassword` - POST

### Productos
- `API_ENDPOINTS.productos.getAll` - GET
- `API_ENDPOINTS.productos.getById(id)` - GET
- `API_ENDPOINTS.productos.create` - POST
- `API_ENDPOINTS.productos.update(id)` - PUT
- `API_ENDPOINTS.productos.delete(id)` - DELETE
- `API_ENDPOINTS.productos.search` - GET

### Ventas
- `API_ENDPOINTS.ventas.getAll` - GET
- `API_ENDPOINTS.ventas.getById(id)` - GET
- `API_ENDPOINTS.ventas.create` - POST
- `API_ENDPOINTS.ventas.statistics` - GET

### Inventario
- `API_ENDPOINTS.inventario.getAll` - GET
- `API_ENDPOINTS.inventario.agregarStock` - POST
- `API_ENDPOINTS.inventario.bajoStock` - GET

### Y más...
Ver `src/config/api.js` para la lista completa de endpoints.

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE

1. **NUNCA** subas el archivo `.env` a Git (ya está en `.gitignore`)
2. **NUNCA** expongas API keys en el código
3. Usa variables de entorno para datos sensibles
4. En producción, configura las variables en tu plataforma de hosting

### Variables sensibles

```env
# ❌ MAL - No hagas esto
const API_KEY = "mi-clave-secreta-12345";

# ✅ BIEN - Usa variables de entorno
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
```

---

## 🛠️ Agregar Nuevos Endpoints

### Paso 1: Crear archivo de endpoints

Crear nuevo archivo en `src/config/endpoints/miModuloEndpoints.js`:

```javascript
import { API_BASE_URL } from '../apiConfig';

export const miModuloEndpoints = {
  base: `${API_BASE_URL}/api/mi-modulo`,
  getAll: `${API_BASE_URL}/api/mi-modulo`,
  getById: (id) => `${API_BASE_URL}/api/mi-modulo/${id}`,
  create: `${API_BASE_URL}/api/mi-modulo`,
  update: (id) => `${API_BASE_URL}/api/mi-modulo/${id}`,
  delete: (id) => `${API_BASE_URL}/api/mi-modulo/${id}`,
};
```

### Paso 2: Exportar en api.js

Editar `src/config/api.js`:

```javascript
// Agregar import
export { miModuloEndpoints } from './endpoints/miModuloEndpoints';

// Agregar al objeto API_ENDPOINTS
import { miModuloEndpoints } from './endpoints/miModuloEndpoints';

export const API_ENDPOINTS = {
  // ... otros endpoints
  miModulo: miModuloEndpoints,
};
```

### Paso 3: Usar el nuevo endpoint

```javascript
import { miModuloEndpoints } from '../config/api';

const datos = await productosService.getAll();
// O directamente con httpClient
import httpClient from '../services/httpClient';
const datos = await httpClient.get(miModuloEndpoints.getAll);
```

---

## 📊 Información del Entorno

```javascript
import { ENV_INFO } from '../config/api';

console.log(ENV_INFO);
// {
//   mode: 'development',
//   isDevelopment: true,
//   isProduction: false,
//   baseURL: 'http://localhost:3000',
//   timeout: 10000
// }
```

---

## 🔄 Migración desde localStorage

Si actualmente usas `useDatabase` con localStorage, puedes migrar gradualmente:

### Antes (localStorage)

```javascript
import useDatabase from '../hooks/useDatabase';

function MiComponente() {
  const { getProductos } = useDatabase();
  const productos = getProductos();
}
```

### Después (Servicios con API)

```javascript
import { productosService } from '../services';
import { useState, useEffect } from 'react';

function MiComponente() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      const data = await productosService.getAll();
      setProductos(data);
    };
    cargarProductos();
  }, []);
}
```

---

## 📝 Notas

- Las URLs se construyen automáticamente según el entorno
- Todos los endpoints están organizados por módulo
- Los servicios incluyen manejo de errores automático
- El timeout se ajusta automáticamente por entorno

---

**Última actualización**: Octubre 2025
