import { Venta } from '@prisma/client';
import { Comision } from '../entities/Comision';

export interface IVentaRepository {
  create(venta: Omit<Venta, 'id'>): Promise<Venta>;
  findById(id: number): Promise<Venta | null>;
  findAll(): Promise<Venta[]>;
  findByCliente(clienteId: number): Promise<Venta[]>;
  findByMoto(motoId: number): Promise<Venta[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Venta[]>;
  updateEstadoTraspaso(ventaId: number, estado: string): Promise<Venta>;
  calcularGanancias(fechaInicio: Date, fechaFin: Date): Promise<{
    totalVentas: number;
    totalGastos: number;
    gananciaNeta: number;
  }>;
  getComisionesByVenta(ventaId: number): Promise<Comision[]>;
} 