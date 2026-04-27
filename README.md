# AOA Backend - Sistema de Gestión de Inventario

API robusta basada en Node.js, Express y GraphQL para la gestión de productos, usuarios y movimientos de inventario (Kardex).

## Tecnologías Principales

- **Runtime:** Node.js
- **Lenguaje:** TypeScript
- **API:** GraphQL (Apollo Server Express)
- **Base de Datos:** MongoDB (Mongoose)
- **Validación:** Joi
- **Autenticación:** JWT + BcryptJS
- **Utilidades:** date-fns

## Arquitectura

El proyecto sigue una estructura modular y organizada por responsabilidades:

- **`src/graphql`**: Definición de esquemas (`typeDefs`) y lógica de negocio (`resolvers`).
- **`src/models`**: Esquemas de Mongoose para la persistencia de datos.
- **`src/services`**: Capa de servicios para lógica reutilizable (ej. `registerMovement`).
- **`src/middlewares`**: Gestión de autenticación y logs de operaciones.
- **`src/utils`**: Funciones de utilidad para permisos y tokens.
- **`src/validations`**: Esquemas de validación de datos de entrada.

## Funcionalidades Clave

1. **Gestión de Inventario (Kardex)**: Registro automático de cada entrada o salida de productos, manteniendo un historial preciso de stock y costos.
2. **Autenticación y Roles**: Sistema basado en JWT con roles de `admin`, `bodeguero`, `consultor` y `user`.
3. **Trazabilidad**: Registro detallado de quién realizó cada movimiento de inventario.
4. **Reportes de Ventas**: Consultas optimizadas para estadísticas diarias, semanales y mensuales.

## Instalación y Uso

### Requisitos
- Node.js (v20+)
- MongoDB (Local o Atlas)

### Pasos
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno (`.env` basado en `.env.example`):
   ```env
   PORT=4000
   MONGODB_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_super_seguro
   ```
3. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```

## Tecnologías y Librerías

### Dependencias de Producción
- **apollo-server-express (3.13.0)**: Servidor GraphQL que se integra con Express para manejar consultas y mutaciones.
- **express (4.22.1)**: Framework web minimalista para Node.js, utilizado para el servidor base y rutas adicionales.
- **mongoose (9.5.0)**: Biblioteca de modelado de datos de objetos (ODM) para MongoDB y Node.js.
- **graphql (16.13.2)**: Implementación de referencia de GraphQL para JavaScript.
- **jsonwebtoken (9.0.3)**: Implementación de JSON Web Tokens para la autenticación segura.
- **bcryptjs (3.0.3)**: Biblioteca para el hashing y salting de contraseñas.
- **joi (17.13.3)**: Validador de esquemas para JavaScript, utilizado para validar inputs de la API.
- **date-fns (4.1.0)**: Biblioteca modular para la manipulación y formateo de fechas.
- **dotenv (17.4.2)**: Carga variables de entorno desde un archivo `.env` a `process.env`.
- **dataloader (2.2.3)**: Utilidad para agrupar y almacenar en caché solicitudes de base de datos, optimizando el rendimiento de GraphQL (N+1 problem).

### Dependencias de Desarrollo
- **typescript (5.4.5)**: Añade tipado estático al código para reducir errores y mejorar la documentación interna.
- **ts-node-dev**: Herramienta de desarrollo que reinicia el servidor automáticamente al detectar cambios en archivos TypeScript.

## Limpieza de Código y Optimización
- **Modularización de Lógica**: Extracción de la lógica de negocio de los resolvers hacia la capa de `services` (ej. `movement.service.ts`).
- **Validación Centralizada**: Uso de middlewares y esquemas de Joi para asegurar que los datos que llegan a los modelos sean siempre válidos.
- **Seguridad**: Implementación de guards para autenticación (`auth.guard.ts`) y control de acceso basado en roles (`roles.guard.ts`).
- **Manejo de Errores**: Estandarización de las respuestas de error en GraphQL para facilitar la depuración en el frontend.

## Resumen del Backend
El backend es una API robusta y segura diseñada bajo una arquitectura de capas. Utiliza **GraphQL** para ofrecer flexibilidad en las consultas, **Mongoose** para una gestión eficiente de MongoDB y un sistema sólido de **JWT** para la seguridad. La inclusión de un sistema de **Kardex** automático garantiza la integridad total del inventario, permitiendo un seguimiento histórico detallado de cada producto y usuario.

## API Endpoints
La API principal está expuesta en `/graphql`. Puedes acceder al Playground de Apollo en modo desarrollo para explorar los esquemas y probar las consultas.

## Despliegue en Render

Este proyecto está configurado para ser desplegado en **Render**.

### Pasos para el Despliegue:
1. Conecta tu repositorio de GitHub a Render.
2. Crea un nuevo **Web Service**.
3. Render detectará automáticamente el archivo `render.yaml` y configurará el servicio.
4. Asegúrate de configurar las siguientes **Variables de Entorno** en el panel de Render:
   - `MONGODB_URI`: URL de conexión a tu base de datos. Ejemplo: `mongodb+srv://wadme5884_db_user:nioqXXm5fdi6Zs8X@cluster0.yecbbmt.mongodb.net/` 
   - `JWT_SECRET`: Una cadena aleatoria y segura para firmar los tokens.
   - `FRONTEND_URL`: La URL de tu aplicación frontend (para habilitar CORS).

### Pasos Críticos en MongoDB Atlas:
1. Ve a **Network Access** en MongoDB Atlas.
2. Agrega la IP `0.0.0.0/0` (Allow Access from Anywhere).
3. Sin esto, Render no podrá conectarse a la base de datos y el servidor fallará al iniciar.

### Scripts de Despliegue:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Puerto**: Render asignará uno automáticamente a través de la variable `PORT`.

