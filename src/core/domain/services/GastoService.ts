import { TipoGasto } from '../entities/TipoGasto';
import { IGastoRepository } from '../repositories/IGastoRepository';

export class GastoService {
  private readonly gastosMotoObligatorios: TipoGasto[] = [
    TipoGasto.MECANICO,
    TipoGasto.REPUESTOS,
    TipoGasto.COMISION,
    TipoGasto.TRASPASO,
    TipoGasto.MANTENIMIENTO
  ];

  constructor(private gastoRepository: IGastoRepository) {}

  async crearGasto(data: {
    tipo: TipoGasto;
    descripcion?: string;
    monto: number;
    motoId?: number;
    comprobante?: string;
    notas?: string;
  }) {
    // Validar que los gastos obligatorios tengan motoId
    if (this.gastosMotoObligatorios.includes(data.tipo) && !data.motoId) {
      throw new Error(`El gasto de tipo ${data.tipo} debe estar asociado a una moto`);
    }

    // Validar que el monto sea positivo
    if (data.monto <= 0) {
      throw new Error('El monto del gasto debe ser mayor a 0');
    }

    return this.gastoRepository.create(data);
  }

  async actualizarGasto(id: number, data: Partial<{
    tipo: TipoGasto;
    descripcion: string;
    monto: number;
    motoId: number;
    comprobante: string;
    notas: string;
    pagado: boolean;
    fechaPago: Date;
  }>) {
    // Si se está actualizando el tipo, validar que los gastos obligatorios tengan motoId
    if (data.tipo && this.gastosMotoObligatorios.includes(data.tipo) && !data.motoId) {
      const gastoActual = await this.gastoRepository.findById(id);
      if (!gastoActual?.motoId) {
        throw new Error(`El gasto de tipo ${data.tipo} debe estar asociado a una moto`);
      }
    }

    // Si se está actualizando el monto, validar que sea positivo
    if (data.monto && data.monto <= 0) {
      throw new Error('El monto del gasto debe ser mayor a 0');
    }

    return this.gastoRepository.update(id, data);
  }

  async marcarComoPagado(id: number) {
    const gasto = await this.gastoRepository.findById(id);
    if (!gasto) {
      throw new Error('Gasto no encontrado');
    }

    return this.gastoRepository.update(id, {
      pagado: true,
      fechaPago: new Date()
    });
  }

  async obtenerGastosPorMoto(motoId: number) {
    return this.gastoRepository.findByMotoId(motoId);
  }

  async obtenerGastosPorTipo(tipo: TipoGasto) {
    return this.gastoRepository.findByTipo(tipo);
  }

  async obtenerGastosPendientes() {
    return this.gastoRepository.findByPagado(false);
  }
} 