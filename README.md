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

## Notas importantes

- El servidor usa `process.env.PORT`, por lo que el archivo `.env` debe incluir ese valor.
- La base de datos está configurada con SQLite y apunta al archivo `src/database/database.sqlite`.
- La configuración de Sequelize CLI en `.sequelizerc` espera la estructura actual dentro de `src/`.
- Sequelize CLI usa `src/config/config.cjs` como archivo de configuración principal.