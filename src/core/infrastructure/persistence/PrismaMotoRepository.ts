import { PrismaClient } from '@prisma/client';
import { IMotoRepository } from '../../domain/repositories/IMotoRepository';

export class PrismaMotoRepository implements IMotoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    marca: string;
    modelo: string;
    año: number;
    kilometraje: number;
    estado: string;
    precioCompra: number;
    precioVenta?: number;
    descripcion?: string;
    fotos?: string[];
    documentos?: {
      matricula?: string;
      soat?: string;
      revisionTecnica?: string;
    };
    reparaciones?: {
      descripcion: string;
      costo: number;
      fecha: Date;
    }[];
  }) {
    return this.prisma.moto.create({
      data: {
        ...data,
        documentos: data.documentos ? JSON.stringify(data.documentos) : undefined,
        reparaciones: data.reparaciones ? JSON.stringify(data.reparaciones) : undefined
      }
    });
  }

  async update(id: number, data: Partial<{
    marca: string;
    modelo: string;
    año: number;
    kilometraje: number;
    estado: string;
    precioCompra: number;
    precioVenta: number;
    descripcion: string;
    fotos: string[];
    documentos: {
      matricula?: string;
      soat?: string;
      revisionTecnica?: string;
    };
    reparaciones: {
      descripcion: string;
      costo: number;
      fecha: Date;
    }[];
  }>) {
    return this.prisma.moto.update({
      where: { id },
      data: {
        ...data,
        documentos: data.documentos ? JSON.stringify(data.documentos) : undefined,
        reparaciones: data.reparaciones ? JSON.stringify(data.reparaciones) : undefined
      }
    });
  }

  async findById(id: number) {
    return this.prisma.moto.findUnique({
      where: { id }
    });
  }

  async findAll() {
    return this.prisma.moto.findMany();
  }

  async findByEstado(estado: string) {
    return this.prisma.moto.findMany({
      where: { estado }
    });
  }

  async findByMarca(marca: string) {
    return this.prisma.moto.findMany({
      where: { marca }
    });
  }

  async findByPrecioRange(min: number, max: number) {
    return this.prisma.moto.findMany({
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
  }) {
    const moto = await this.findById(motoId);
    if (!moto) throw new Error('Moto no encontrada');

    const reparaciones = moto.reparaciones ? JSON.parse(moto.reparaciones as string) : [];
    reparaciones.push(reparacion);

    return this.prisma.moto.update({
      where: { id: motoId },
      data: {
        reparaciones: JSON.stringify(reparaciones)
      }
    });
  }

  async updateEstado(motoId: number, estado: string) {
    return this.prisma.moto.update({
      where: { id: motoId },
      data: { estado }
    });
  }
} 