import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { MotoController } from './core/infrastructure/controllers/MotoController';
import { MotoApplicationService } from './core/application/services/MotoApplicationService';
import { MotoService } from './core/domain/services/MotoService';
import { IMotoRepository } from './core/domain/repositories/IMotoRepository';
import { createMotoRoutes } from './core/infrastructure/routes/moto.routes';

const app = express();
const prisma = new PrismaClient();

// Implementación del repositorio
class PrismaMotoRepository implements IMotoRepository {
  async create(moto: any): Promise<any> {
    return prisma.moto.create({ data: moto });
  }

  async update(id: string, moto: any): Promise<any> {
    return prisma.moto.update({
      where: { id: parseInt(id) },
      data: moto,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.moto.delete({
      where: { id: parseInt(id) },
    });
  }

  async findById(id: string): Promise<any> {
    return prisma.moto.findUnique({
      where: { id: parseInt(id) },
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

  async findByCliente(clienteId: string): Promise<any[]> {
    return prisma.moto.findMany({
      where: { clienteActualId: parseInt(clienteId) },
    });
  }
}

// Configuración de la aplicación
app.use(cors());
app.use(express.json());

// Inicialización de servicios
const motoRepository = new PrismaMotoRepository();
const motoService = new MotoService(motoRepository);
const motoApplicationService = new MotoApplicationService(motoService);
const motoController = new MotoController(motoApplicationService);

// Rutas
app.use('/api/motos', createMotoRoutes(motoController));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Backend de compraventa de motos funcionando! 🏍️');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Sistema de eventos para futura escalabilidad
interface SistemaEventos {
  emit(event: string, data: any): void;
  on(event: string, callback: (data: any) => void): void;
}