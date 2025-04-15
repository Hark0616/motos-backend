import { PrismaClient } from '@prisma/client';
import { IGastoRepository } from '../../domain/repositories/IGastoRepository';
import { TipoGasto } from '../../domain/entities/TipoGasto';

export class PrismaGastoRepository implements IGastoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    tipo: TipoGasto;
    descripcion?: string;
    monto: number;
    motoId?: number;
    comprobante?: string;
    notas?: string;
  }) {
    return this.prisma.gasto.create({
      data: {
        ...data,
        tipo: data.tipo as any, // Convertir nuestro enum a string para Prisma
      },
    });
  }

  async update(id: number, data: Partial<{
    tipo: TipoGasto;
    descripcion: string;
    monto: number;
    motoId: number;
    comprobante: string;
    notas: string;
    pagado: boolean;
    fechaPago: Date;
  }>) {
    return this.prisma.gasto.update({
      where: { id },
      data: {
        ...data,
        tipo: data.tipo as any, // Convertir nuestro enum a string para Prisma
      },
    });
  }

  async findById(id: number) {
    return this.prisma.gasto.findUnique({
      where: { id },
    });
  }

  async findByMotoId(motoId: number) {
    return this.prisma.gasto.findMany({
      where: { motoId },
    });
  }

  async findByTipo(tipo: TipoGasto) {
    return this.prisma.gasto.findMany({
      where: { tipo: tipo as any },
    });
  }

  async findByPagado(pagado: boolean) {
    return this.prisma.gasto.findMany({
      where: { pagado },
    });
  }
} 