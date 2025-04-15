# Sistema de Gestión de Motos - Backend

## Descripción
Sistema backend para la gestión de venta y compra de motos, incluyendo control de gastos, comisiones y clientes.

## Características Principales
- Gestión de motos (compra, venta, estado)
- Control de gastos y comisiones
- Gestión de clientes
- Sistema de autenticación y autorización
- Generación de reportes y cálculos de ganancias
- API RESTful con Express y TypeScript
- Base de datos PostgreSQL con Prisma ORM

## Estructura del Proyecto
```
backend/
├── prisma/                 # Configuración de Prisma y esquema de base de datos
├── src/
│   ├── core/
│   │   ├── domain/         # Lógica de negocio
│   │   │   ├── entities/   # Entidades del dominio
│   │   │   ├── repositories/ # Interfaces de repositorios
│   │   │   └── services/   # Servicios de negocio
│   │   └── infrastructure/ # Implementación de infraestructura
│   │       ├── controllers/ # Controladores de la API
│   │       ├── middleware/  # Middleware de autenticación y otros
│   │       ├── persistence/ # Implementación de repositorios
│   │       └── routes/     # Definición de rutas
│   └── index.ts           # Punto de entrada de la aplicación
├── .env                   # Variables de entorno (no versionado)
├── .env.example          # Ejemplo de variables de entorno
├── package.json          # Dependencias y scripts
└── tsconfig.json         # Configuración de TypeScript
```

## Requisitos Previos
- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

## Instalación
1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Configurar las variables de entorno en `.env`
5. Inicializar la base de datos:
   ```bash
   npx prisma migrate dev
   ```

## Configuración de la Base de Datos
El proyecto utiliza PostgreSQL como base de datos. Asegúrate de tener:
1. Una instancia de PostgreSQL en ejecución
2. Las credenciales correctas en el archivo `.env`
3. La base de datos creada y accesible

## Variables de Entorno
```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
JWT_SECRET="tu-secreto-jwt"
PORT=3000
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/usuarios` - Crear usuario (solo ADMIN)
- `PUT /api/auth/usuarios/password` - Cambiar contraseña
- `PUT /api/auth/usuarios/:usuarioId/desactivar` - Desactivar usuario (solo ADMIN)

### Motos
- `GET /api/motos` - Listar todas las motos
- `GET /api/motos/:id` - Obtener moto por ID
- `POST /api/motos` - Crear nueva moto
- `PUT /api/motos/:id` - Actualizar moto
- `GET /api/motos/estado/:estado` - Filtrar por estado
- `GET /api/motos/marca/:marca` - Filtrar por marca

### Ventas
- `POST /api/ventas` - Crear nueva venta
- `GET /api/ventas/:id` - Obtener venta por ID
- `GET /api/ventas` - Listar todas las ventas
- `GET /api/ventas/cliente/:clienteId` - Obtener ventas por cliente
- `GET /api/ventas/moto/:motoId` - Obtener ventas por moto
- `GET /api/ventas/fecha` - Filtrar ventas por rango de fechas
- `PUT /api/ventas/:id/traspaso` - Actualizar estado de traspaso
- `GET /api/ventas/reportes/ganancias` - Calcular ganancias (solo ADMIN)
- `GET /api/ventas/reportes/general` - Generar reporte general (solo ADMIN)
- `GET /api/ventas/:id/comisiones` - Obtener comisiones por venta

### Gastos
- `POST /api/gastos` - Crear nuevo gasto
- `GET /api/gastos` - Listar todos los gastos
- `GET /api/gastos/:id` - Obtener gasto por ID
- `PUT /api/gastos/:id` - Actualizar gasto
- `PUT /api/gastos/:id/pagar` - Marcar gasto como pagado
- `GET /api/gastos/moto/:motoId` - Obtener gastos por moto
- `GET /api/gastos/tipo/:tipo` - Filtrar por tipo de gasto
- `GET /api/gastos/pendientes` - Obtener gastos pendientes

## Roles de Usuario
- ADMIN: Acceso total al sistema
- VENDEDOR: Puede gestionar ventas y clientes
- MECANICO: Puede gestionar reparaciones y mantenimiento

## Desarrollo
1. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
2. Ejecutar pruebas:
   ```bash
   npm test
   ```
3. Generar documentación:
   ```bash
   npm run docs
   ```

## Despliegue
1. Construir la aplicación:
   ```bash
   npm run build
   ```
2. Iniciar en producción:
   ```bash
   npm start
   ```

## Contribución
1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 