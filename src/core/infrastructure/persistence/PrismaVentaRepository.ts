import { PrismaClient, Venta } from '@prisma/client';
import { IVentaRepository } from '../../domain/repositories/IVentaRepository';
import { Comision } from '../../domain/entities/Comision';

interface RawComision extends Omit<Comision, 'moto'> {
  moto: string;
}

export class PrismaVentaRepository implements IVentaRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(venta: Omit<Venta, 'id'>): Promise<Venta> {
    return this.prisma.venta.create({
      data: venta,
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      }
    });
  }

  async findById(id: number): Promise<Venta | null> {
    return this.prisma.venta.findUnique({
      where: { id },
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      }
    });
  }

  async findAll(): Promise<Venta[]> {
    return this.prisma.venta.findMany({
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  async findByCliente(clienteId: number): Promise<Venta[]> {
    return this.prisma.venta.findMany({
      where: { clienteId },
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  async findByMoto(motoId: number): Promise<Venta[]> {
    return this.prisma.venta.findMany({
      where: { motoId },
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Venta[]> {
    return this.prisma.venta.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  async updateEstadoTraspaso(ventaId: number, estado: string): Promise<Venta> {
    return this.prisma.venta.update({
      where: { id: ventaId },
      data: { traspasoEstado: estado },
      include: {
        moto: {
          include: {
            gastos: true
          }
        },
        cliente: true
      }
    });
  }

  async calcularGanancias(fechaInicio: Date, fechaFin: Date): Promise<{
    totalVentas: number;
    totalGastos: number;
    gananciaNeta: number;
  }> {
    const [ventas, gastos] = await Promise.all([
      this.prisma.venta.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        select: {
          precio: true,
          moto: {
            select: {
              precioCompra: true
            }
          }
        }
      }),
      this.prisma.gasto.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        select: {
          monto: true
        }
      })
    ]);

    const totalVentas = ventas.reduce((sum, venta) => sum + venta.precio, 0);
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const totalCompras = ventas.reduce((sum, venta) => sum + (venta.moto?.precioCompra || 0), 0);
    
    return {
      totalVentas,
      totalGastos: totalGastos + totalCompras,
      gananciaNeta: totalVentas - (totalGastos + totalCompras)
    };
  }

  async getComisionesByVenta(ventaId: number): Promise<Comision[]> {
    const result = await this.prisma.$queryRaw<RawComision[]>`
      SELECT 
        c.id,
        c.monto,
        c.fecha,
        c.pagado,
        c."fechaPago",
        c."motoId",
        c."ventaId",
        c.notas,
        json_build_object(
          'id', m.id,
          'marca', m.marca,
          'modelo', m.modelo,
          'año', m.año,
          'kilometraje', m.kilometraje,
          'estado', m.estado,
          'precioCompra', m."precioCompra",
          'precioVenta', m."precioVenta"
        ) as moto
      FROM "Comision" c
      JOIN "Moto" m ON c."motoId" = m.id
      WHERE c."ventaId" = ${ventaId}
    `;

    return result.map(row => ({
      ...row,
      moto: row.moto ? JSON.parse(row.moto) : undefined
    }));
  }
} 