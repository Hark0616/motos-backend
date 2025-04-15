# Sistema de Gestión de Motos - Backend

Backend para el sistema de gestión de compra/venta de motos.

## Requisitos Previos

- Node.js >= 18.0.0
- Cuenta en Supabase (https://supabase.com)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/motos-backend.git
cd motos-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de Supabase:
- Ve a tu proyecto en Supabase (https://app.supabase.com)
- En la sección "Project Settings" > "Database" encontrarás la URL de conexión
- En "Project Settings" > "API" encontrarás:
  - Project URL (SUPABASE_URL)
  - anon/public key (SUPABASE_ANON_KEY)
  - service_role key (SUPABASE_SERVICE_ROLE_KEY)

4. Configurar la base de datos:
```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate
```

## Configuración de Supabase

1. Crear un nuevo proyecto en Supabase:
   - Ve a https://supabase.com
   - Crea una cuenta o inicia sesión
   - Crea un nuevo proyecto
   - Espera a que se complete la configuración

2. Obtener las credenciales:
   - Project URL: Se encuentra en Project Settings > API
   - Database Password: Se establece al crear el proyecto
   - API Keys: Se encuentran en Project Settings > API

3. Configurar la base de datos:
   - Las migraciones de Prisma se ejecutarán automáticamente
   - Verifica que las tablas se hayan creado correctamente

## Desarrollo

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Producción

Para construir y ejecutar en producción:
```bash
# Construir la aplicación
npm run build

# Iniciar el servidor
npm start
```

## API Endpoints

### Gastos

- `POST /api/gastos` - Crear un nuevo gasto
  ```json
  {
    "tipo": "MECANICO",
    "descripcion": "Cambio de aceite",
    "monto": 150.00,
    "motoId": 1,
    "comprobante": "https://ejemplo.com/comprobante.jpg",
    "notas": "Cambio de aceite y filtro"
  }
  ```

- `PUT /api/gastos/:id` - Actualizar un gasto existente
- `PATCH /api/gastos/:id/pagar` - Marcar un gasto como pagado
- `GET /api/gastos/moto/:motoId` - Obtener gastos por moto
- `GET /api/gastos/tipo/:tipo` - Obtener gastos por tipo
- `GET /api/gastos/pendientes` - Obtener gastos pendientes

## Estructura del Proyecto

```
backend/
├── src/
│   ├── core/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   └── infrastructure/
│   │       ├── controllers/
│   │       ├── dto/
│   │       ├── persistence/
│   │       └── routes/
│   ├── prisma/
│   │   └── schema.prisma
│   └── app.ts
├── .env.example
├── package.json
└── README.md
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 