import { PrismaClient } from '@prisma/client';

export class MotoService {
  constructor(private prisma: PrismaClient) {}

  async crearMoto(data: any) {
    return this.prisma.moto.create({
      data
    });
  }

  async actualizarMoto(id: number, data: any) {
    return this.prisma.moto.update({
      where: { id },
      data
    });
  }

  async obtenerMoto(id: number) {
    return this.prisma.moto.findUnique({
      where: { id }
    });
  }

  async obtenerTodas() {
    return this.prisma.moto.findMany();
  }

  async obtenerPorEstado(estado: string) {
    return this.prisma.moto.findMany({
      where: { estado }
    });
  }

  async cambiarEstado(id: number, estado: string) {
    return this.prisma.moto.update({
      where: { id },
      data: { estado }
    });
  }

  async agregarReparacion(id: number, reparacion: any) {
    const moto = await this.obtenerMoto(id);
    if (!moto) throw new Error('Moto no encontrada');

    const reparaciones = moto.reparaciones ? JSON.parse(moto.reparaciones as string) : [];
    reparaciones.push(reparacion);

    return this.prisma.moto.update({
      where: { id },
      data: { reparaciones: JSON.stringify(reparaciones) }
    });
  }

  async calcularPrecioSugerido(id: number) {
    const moto = await this.obtenerMoto(id);
    if (!moto) throw new Error('Moto no encontrada');

    // Lógica para calcular el precio sugerido
    const precioBase = moto.precioCompra;
    const gastos = await this.prisma.gasto.findMany({
      where: { motoId: id }
    });

    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const margenGanancia = 0.2; // 20% de margen de ganancia

    return precioBase + totalGastos + (precioBase + totalGastos) * margenGanancia;
  }
} 