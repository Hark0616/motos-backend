import { PrismaClient } from '@prisma/client';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { Cliente } from '../../domain/entities/Cliente';

export class PrismaClienteRepository implements IClienteRepository {
  constructor(private prisma: PrismaClient) {}

  async create(cliente: Cliente): Promise<Cliente> {
    return this.prisma.cliente.create({
      data: cliente
    });
  }

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    return this.prisma.cliente.update({
      where: { id },
      data: cliente
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cliente.delete({
      where: { id }
    });
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { id }
    });
  }

  async findAll(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany();
  }

  async findByCedula(cedula: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { cedula }
    });
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { email }
    });
  }

  async findByNombre(nombre: string): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: { nombre: { contains: nombre } }
    });
  }

  async findByApellido(apellido: string): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: { apellido: { contains: apellido } }
    });
  }

  async search(query: string): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: {
        OR: [
          { nombre: { contains: query } },
          { apellido: { contains: query } },
          { cedula: { contains: query } },
          { email: { contains: query } }
        ]
      }
    });
  }

  async getHistorialCompras(clienteId: number): Promise<any[]> {
    return this.prisma.compra.findMany({
      where: { clienteId },
      include: {
        moto: true
      }
    });
  }

  async getHistorialVentas(clienteId: number): Promise<any[]> {
    return this.prisma.venta.findMany({
      where: { clienteId },
      include: {
        moto: true
      }
    });
  }
} 