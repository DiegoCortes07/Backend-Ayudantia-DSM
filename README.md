# Backend Ayudantía DSM

Proyecto backend hecho con Node.js, Express, Sequelize y SQLite. La aplicación arranca desde `src/app.js`, crea un servidor HTTP en `src/server.js` y valida la conexión a la base de datos al cargar `src/config/database.js`.

## Requisitos

- Node.js instalado
- npm instalado

## Instalación

1. Clona o abre el proyecto en tu máquina.
2. Instala dependencias:

```bash
npm install
```

3. Crea o revisa el archivo `.env` en la raíz del proyecto.
4. Define al menos la variable `PORT`.

Ejemplo:

```env
PORT=3000
```

## Ejecución

Para iniciar el proyecto en modo desarrollo:

```bash
npm run dev
```

La aplicación levanta un servidor Express en el puerto definido en `.env` y, al iniciar, intenta conectarse a SQLite.

## Estructura del proyecto

### Archivos y carpetas raíz

- `.env`: variables de entorno del proyecto, como el puerto del servidor.
- `.git/`: historial y metadatos internos de Git.
- `.gitignore`: archivos y carpetas que Git no debe versionar.
- `.sequelizerc`: configuración de rutas para Sequelize CLI, incluyendo el archivo de configuración principal.
- `package.json`: definición del proyecto, dependencias y scripts.
- `package-lock.json`: bloquea versiones exactas de las dependencias instaladas.
- `node_modules/`: dependencias instaladas por npm. No se edita manualmente.

### Carpeta `src/`

Contiene el código principal de la aplicación.

- `src/app.js`: punto de entrada actual de la aplicación. Crea el servidor e inicia la escucha.
- `src/server.js`: clase principal del servidor. Configura Express, carga variables de entorno y define las rutas base.
- `src/config/`: configuración general del proyecto.
- `src/controllers/`: aquí irán los controladores que recibirán la lógica de cada endpoint.
- `src/models/`: aquí irán los modelos de Sequelize que representen las tablas de la base de datos.
- `src/routes/`: aquí se definirán las rutas de la API y su relación con los controladores.
- `src/database/`: carpeta destinada a la base de datos local y a la organización de migraciones.

### Carpeta `src/config/`

- `src/config/database.js`: configura Sequelize con SQLite y valida la conexión al iniciar la aplicación.
- `src/config/config.cjs`: configuración para Sequelize CLI (entorno `development`) y ruta de la base de datos.

### Carpeta `src/database/`

- `src/database/database.sqlite`: archivo físico de la base de datos SQLite.
- `src/database/migrations/`: carpeta reservada para migraciones de la base de datos.
- `src/database/seedDatabase.js`: ejecuta la carga inicial de datos usando una transacción.
- `src/database/seeders/`: contiene los seeders iniciales para roles, usuarios y productos.

## Registro de ayudantías

### Ayudantía 1 - Inicialización del proyecto

- Servidor Express inicializado con clase `Server` en `src/server.js`
- Conexión a SQLite configurada en `src/config/database.js`
- Estructura base de carpetas: `controllers/`, `models/`, `routes/`, `database/`
- Configuración de Sequelize CLI con `config.cjs` y `.sequelizerc`
- Carpeta para migraciones preparada

### Ayudantía 2 - Modelos, Migraciones y Controladores

**Branch:** `Ayudantia2-Modelos-Migraciones-Controllador`

#### Modelos creados

- **Role** (`src/models/role.js`): campos `id`, `name`, `description`
- **User** (`src/models/user.js`): campos `id`, `email`, `password`, `name`, `username`, `phone`, `profile_picture`, `language`, `theme` (ENUM: light/dark/automatic), `roleId` (FK a Roles), `status` (ENUM: active/suspend/unconfirmed)

#### Asociaciones (`src/models/associations.js`)

- `Role.hasMany(User)` — un rol tiene muchos usuarios
- `User.belongsTo(Role)` — un usuario pertenece a un rol

#### Migraciones creadas (`src/database/migrations/`)

- `20260408160008-create-roles.cjs` — crea tabla `Roles`
- `20260408202538-create-user.cjs` — crea tabla `Users` con FK a `Roles`

#### Rutas

- Router principal en `src/routes/api.js` bajo el prefijo `/api`
- **Roles** (`src/routes/api/role.js`):
  - `GET /api/role/` — obtener todos los roles
  - `POST /api/role/` — crear un rol
- **Users** (`src/routes/api/user.js`):
  - `GET /api/user/` — obtener todos los usuarios
  - `POST /api/user/` — crear un usuario

#### Controladores

- **Role** (`src/controllers/role.js`):
  - `getRoles` — retorna todos los roles
  - `createRole` — crea un rol (requiere `name`)
- **User** (`src/controllers/user.js`):
  - `getUsers` — retorna todos los usuarios
  - `createUser` — crea un usuario validando campos requeridos (`email`, `password`, `name`, `username`, `phone`) y verificando duplicados de `email`, `username` y `phone` con una sola query usando `Op.or`

#### Cambios en `src/server.js`

- Se agregaron middlewares: `express.json()` y `cors()`
- Se reemplazó la ruta temporal por el router principal (`/api`)
- Se inicializan las asociaciones de modelos al arrancar

#### Pruebas HTTP (`Pruebas http/`)

- `role.http` — pruebas para GET y POST de roles
- `user.http` — pruebas para GET y POST de usuarios

#### Diagrama

- `Modelo ER.png` — diagrama entidad-relación del proyecto

### Ayudantía 4 - Productos y datos iniciales

En esta ayudantía se agregó el módulo de productos y se incorporó una carga inicial de datos para levantar la aplicación con información base.

#### Modelo Product

- **Product** (`src/models/product.js`): representa la tabla `Products`.
- Campos definidos:
  - `id`: entero, autoincremental, clave primaria.
  - `name`: texto obligatorio.
  - `description`: texto opcional.
  - `price`: decimal obligatorio con formato `DECIMAL(10, 2)`.
  - `stock`: entero obligatorio, con valor por defecto `0`.
  - `is_active`: booleano obligatorio, con valor por defecto `true`.
- El modelo usa `timestamps: false`, igual que los modelos trabajados previamente.

#### Migración de productos

- `src/database/migrations/20260506110000-create-products.cjs` crea la tabla `Products`.
- La migración define los mismos campos del modelo `Product`.
- El método `down` elimina la tabla `Products` con `dropTable`.

#### Controlador de productos

- **Product** (`src/controllers/product.js`):
  - `getProducts`: obtiene todos los productos con `Product.findAll()`.
  - Si no existen productos, responde con estado `400` y el mensaje `No se encontraron productos`.
  - Si existen productos, responde con estado `200` y el listado.
  - `createProduct`: crea un producto nuevo desde el body de la request.
  - Valida que existan los campos obligatorios `name`, `price` y `stock`.
  - Valida que `price` y `stock` no sean negativos.
  - Si `description` no viene en el body, se guarda como `null`.
  - Si `is_active` no viene en el body, se guarda como `true`.

#### Rutas de productos

- **Products** (`src/routes/api/product.js`):
  - `GET /api/products/` — obtener todos los productos.
  - `POST /api/products/` — crear un producto.
- El router principal (`src/routes/api.js`) importa `RouterProduct` y lo monta bajo el prefijo `/products`.

#### Seeds iniciales

- Se agregó `src/database/seedDatabase.js` para centralizar la ejecución de seeds.
- `seedDatabase` ejecuta `sequelize.sync()` y luego corre los seeds dentro de una transacción.
- Si ocurre un error durante la carga inicial, se hace `rollback` y se detiene el inicio del servidor.
- Seeds creados:
  - `src/database/seeders/roles.js`: crea los roles `Usuario` y `Admin` si la tabla `Roles` está vacía.
  - `src/database/seeders/users.js`: crea usuarios iniciales si la tabla `Users` está vacía.
  - `src/database/seeders/products.js`: crea productos iniciales si la tabla `Products` está vacía.
- Los usuarios iniciales usan `bcrypt` para guardar la contraseña hasheada.
- La contraseña base usada por el seeder de usuarios es `password123`.

#### Cambios en User

- En `src/models/user.js` se corrigió la ubicación del campo `status`.
- `status` queda definido como un atributo propio del modelo `User`, no dentro de la configuración de `roleId`.
- Valores permitidos para `status`: `active`, `suspend`, `unconfirmed`.
- Valor por defecto: `active`.

#### Cambios en Server

- En `src/server.js` el método `listen` ahora es `async`.
- Al iniciar el servidor se ejecutan:
  - `initializeAssociations()`
  - `seedDatabase()`
- Se agregó el middleware `morgan("dev")` para registrar las requests en consola durante el desarrollo.
- Si falla la inicialización, el servidor muestra el error y termina el proceso con `process.exit(1)`.

#### Pruebas HTTP

- `Pruebas http/product.http` incluye pruebas manuales para:
  - `GET http://localhost:8000/api/products/`
  - `POST http://localhost:8000/api/products/` creando un producto completo.
  - `POST http://localhost:8000/api/products/` creando un producto sin descripción.

## Notas importantes

- El servidor usa `process.env.PORT`, por lo que el archivo `.env` debe incluir ese valor.
- La base de datos está configurada con SQLite y apunta al archivo `src/database/database.sqlite`.
- La configuración de Sequelize CLI en `.sequelizerc` espera la estructura actual dentro de `src/`.
- Sequelize CLI usa `src/config/config.cjs` como archivo de configuración principal.
- Al iniciar el servidor, `seedDatabase()` sincroniza los modelos y carga datos iniciales solo cuando las tablas están vacías.
