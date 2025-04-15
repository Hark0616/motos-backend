import { Moto, EstadoMoto } from '../../domain/entities/Moto';
import { MotoService } from '../../domain/services/MotoService';
import { CrearMotoDTO } from '../dtos/CrearMotoDTO';

export class MotoApplicationService {
  constructor(private motoService: MotoService) {}

  async crearMoto(dto: CrearMotoDTO): Promise<Moto> {
    const moto = new Moto({
      ...dto,
      estado: EstadoMoto.EN_EVALUACION,
      fechaCompra: new Date(),
    });

    return this.motoService.crearMoto(moto);
  }

  async actualizarMoto(id: string, dto: Partial<CrearMotoDTO>): Promise<Moto> {
    return this.motoService.actualizarMoto(id, dto);
  }

  async cambiarEstado(id: string, estado: EstadoMoto): Promise<Moto> {
    return this.motoService.cambiarEstado(id, estado);
  }

  async agregarReparacion(id: string, descripcion: string, costo: number): Promise<Moto> {
    return this.motoService.agregarReparacion(id, descripcion, costo);
  }

  async calcularPrecioSugerido(id: string): Promise<number> {
    return this.motoService.calcularPrecioSugerido(id);
  }
} 