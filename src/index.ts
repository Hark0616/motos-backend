import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { MotoController } from './core/infrastructure/controllers/MotoController';
import { MotoApplicationService } from './core/application/services/MotoApplicationService';
import { MotoService } from './core/domain/services/MotoService';
import { IMotoRepository } from './core/domain/repositories/IMotoRepository';
import { createMotoRoutes } from './core/infrastructure/routes/moto.routes';
import { createAuthRoutes } from './core/infrastructure/routes/auth.routes';
import { createClienteRoutes } from './core/infrastructure/routes/cliente.routes';
import { createVentaRoutes } from './core/infrastructure/routes/venta.routes';
import { AuthService } from './core/domain/services/AuthService';
import { ClienteService } from './core/domain/services/ClienteService';
import { VentaService } from './core/domain/services/VentaService';
import { AuthController } from './core/infrastructure/controllers/AuthController';
import { ClienteController } from './core/infrastructure/controllers/ClienteController';
import { VentaController } from './core/infrastructure/controllers/VentaController';
import { PrismaClienteRepository } from './core/infrastructure/persistence/PrismaClienteRepository';
import { PrismaVentaRepository } from './core/infrastructure/persistence/PrismaVentaRepository';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Implementación del repositorio
class PrismaMotoRepository implements IMotoRepository {
  async create(moto: any): Promise<any> {
    return prisma.moto.create({ data: moto });
  }

  async update(id: number, moto: any): Promise<any> {
    return prisma.moto.update({
      where: { id },
      data: moto,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.moto.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<any> {
    return prisma.moto.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<any[]> {
    return prisma.moto.findMany();
  }

  async findByEstado(estado: string): Promise<any[]> {
    return prisma.moto.findMany({
      where: { estado },
    });
  }

  async findByMarca(marca: string): Promise<any[]> {
    return prisma.moto.findMany({
      where: { marca },
    });
  }

  async findByPrecioRange(min: number, max: number): Promise<any[]> {
    return prisma.moto.findMany({
      where: {
        precioVenta: {
          gte: min,
          lte: max
        }
      }
    });
  }

  async addReparacion(motoId: number, reparacion: {
    descripcion: string;
    costo: number;
    fecha: Date;
  }): Promise<any> {
    const moto = await this.findById(motoId);
    if (!moto) throw new Error('Moto no encontrada');

    const reparaciones = moto.reparaciones ? JSON.parse(moto.reparaciones as string) : [];
    reparaciones.push(reparacion);

    return this.update(motoId, { reparaciones: JSON.stringify(reparaciones) });
  }

  async updateEstado(motoId: number, estado: string): Promise<any> {
    return this.update(motoId, { estado });
  }
}

// Configuración de la aplicación
app.use(cors());
app.use(express.json());

// Inicialización de repositorios
const motoRepository = new PrismaMotoRepository();
const clienteRepository = new PrismaClienteRepository(prisma);
const ventaRepository = new PrismaVentaRepository(prisma);

// Inicialización de servicios
const motoService = new MotoService(prisma);
const motoApplicationService = new MotoApplicationService(motoService);
const authService = new AuthService(prisma);
const clienteService = new ClienteService(clienteRepository);
const ventaService = new VentaService(ventaRepository);

// Inicialización de controladores
const motoController = new MotoController(motoApplicationService);
const authController = new AuthController(prisma);
const clienteController = new ClienteController(prisma);
const ventaController = new VentaController(prisma);

// Rutas
app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/motos', createMotoRoutes(motoController));
app.use('/api/clientes', createClienteRoutes(clienteController));
app.use('/api/ventas', createVentaRoutes(ventaController));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Backend de compraventa de motos funcionando! 🏍️');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Sistema de eventos para futura escalabilidad
interface SistemaEventos {
  emit(event: string, data: any): void;
  on(event: string, callback: (data: any) => void): void;
}