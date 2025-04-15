import { IVentaRepository } from '../repositories/IVentaRepository';
import { Venta } from '@prisma/client';
import { Comision } from '../entities/Comision';

export class VentaService {
  constructor(private ventaRepository: IVentaRepository) {}

  async crearVenta(venta: Omit<Venta, 'id'>): Promise<Venta> {
    // Validar que la venta tenga todos los campos requeridos
    if (!venta.motoId || !venta.clienteId || !venta.precio || !venta.formaPago) {
      throw new Error('Faltan campos requeridos para la venta');
    }

    // Validar que el precio sea positivo
    if (venta.precio <= 0) {
      throw new Error('El precio de la venta debe ser positivo');
    }

    // Crear la venta
    return this.ventaRepository.create(venta);
  }

  async obtenerVenta(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findById(id);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }
    return venta;
  }

  async listarVentas(): Promise<Venta[]> {
    return this.ventaRepository.findAll();
  }

  async obtenerVentasPorCliente(clienteId: number): Promise<Venta[]> {
    return this.ventaRepository.findByCliente(clienteId);
  }

  async obtenerVentasPorMoto(motoId: number): Promise<Venta[]> {
    return this.ventaRepository.findByMoto(motoId);
  }

  async obtenerVentasPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Venta[]> {
    // Validar que las fechas sean válidas
    if (!fechaInicio || !fechaFin) {
      throw new Error('Se requieren fecha de inicio y fin');
    }

    if (fechaInicio > fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    return this.ventaRepository.findByFechaRange(fechaInicio, fechaFin);
  }

  async actualizarEstadoTraspaso(ventaId: number, estado: string): Promise<Venta> {
    // Validar que la venta exista
    const venta = await this.ventaRepository.findById(ventaId);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    // Validar que el estado sea válido
    const estadosValidos = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO'];
    if (!estadosValidos.includes(estado)) {
      throw new Error('Estado de traspaso inválido');
    }

    return this.ventaRepository.updateEstadoTraspaso(ventaId, estado);
  }

  async calcularGanancias(fechaInicio: Date, fechaFin: Date): Promise<{
    totalVentas: number;
    totalGastos: number;
    gananciaNeta: number;
  }> {
    // Validar que las fechas sean válidas
    if (!fechaInicio || !fechaFin) {
      throw new Error('Se requieren fecha de inicio y fin');
    }

    if (fechaInicio > fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    return this.ventaRepository.calcularGanancias(fechaInicio, fechaFin);
  }

  async generarReporteVentas(fechaInicio: Date, fechaFin: Date): Promise<{
    ventas: Venta[];
    totalVentas: number;
    totalGastos: number;
    gananciaNeta: number;
  }> {
    // Validar que las fechas sean válidas
    if (!fechaInicio || !fechaFin) {
      throw new Error('Se requieren fecha de inicio y fin');
    }

    if (fechaInicio > fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    const [ventas, ganancias] = await Promise.all([
      this.ventaRepository.findByFechaRange(fechaInicio, fechaFin),
      this.ventaRepository.calcularGanancias(fechaInicio, fechaFin)
    ]);

    return {
      ventas,
      ...ganancias
    };
  }

  async obtenerComisionesPorVenta(ventaId: number): Promise<Comision[]> {
    const venta = await this.ventaRepository.findById(ventaId);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    return this.ventaRepository.getComisionesByVenta(ventaId);
  }
} 