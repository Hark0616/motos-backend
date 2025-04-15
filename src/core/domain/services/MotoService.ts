import { Moto, EstadoMoto } from '../entities/Moto';
import { IMotoRepository } from '../repositories/IMotoRepository';

export class MotoService {
  constructor(private motoRepository: IMotoRepository) {}

  async crearMoto(moto: Moto): Promise<Moto> {
    // Validaciones de negocio
    if (moto.kilometraje < 0) {
      throw new Error('El kilometraje no puede ser negativo');
    }
    if (moto.precioCompra <= 0) {
      throw new Error('El precio de compra debe ser mayor a 0');
    }

    moto.estado = EstadoMoto.EN_EVALUACION;
    return this.motoRepository.create(moto);
  }

  async actualizarMoto(id: string, moto: Partial<Moto>): Promise<Moto> {
    const motoExistente = await this.motoRepository.findById(id);
    if (!motoExistente) {
      throw new Error('Moto no encontrada');
    }

    return this.motoRepository.update(id, moto);
  }

  async cambiarEstado(id: string, nuevoEstado: EstadoMoto): Promise<Moto> {
    const moto = await this.motoRepository.findById(id);
    if (!moto) {
      throw new Error('Moto no encontrada');
    }

    moto.cambiarEstado(nuevoEstado);
    return this.motoRepository.update(id, { estado: nuevoEstado });
  }

  async agregarReparacion(id: string, descripcion: string, costo: number): Promise<Moto> {
    const moto = await this.motoRepository.findById(id);
    if (!moto) {
      throw new Error('Moto no encontrada');
    }

    moto.agregarReparacion(descripcion, costo);
    return this.motoRepository.update(id, { reparaciones: moto.reparaciones });
  }

  async calcularPrecioSugerido(id: string): Promise<number> {
    const moto = await this.motoRepository.findById(id);
    if (!moto) {
      throw new Error('Moto no encontrada');
    }

    return moto.calcularPrecioSugerido();
  }
} 