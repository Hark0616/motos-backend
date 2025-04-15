import { Moto, EstadoMoto } from '../../domain/entities/Moto';
import { MotoService } from '../../domain/services/MotoService';
import { CrearMotoDTO } from '../dtos/CrearMotoDTO';

export class MotoApplicationService {
  constructor(private motoService: MotoService) {}

  async crearMoto(data: any) {
    return this.motoService.crearMoto(data);
  }

  async actualizarMoto(id: number, data: any) {
    return this.motoService.actualizarMoto(id, data);
  }

  async obtenerMoto(id: number) {
    return this.motoService.obtenerMoto(id);
  }

  async obtenerTodas() {
    return this.motoService.obtenerTodas();
  }

  async obtenerPorEstado(estado: string) {
    return this.motoService.obtenerPorEstado(estado);
  }

  async cambiarEstado(id: number, estado: string) {
    return this.motoService.cambiarEstado(id, estado);
  }

  async agregarReparacion(id: number, reparacion: any) {
    return this.motoService.agregarReparacion(id, reparacion);
  }

  async calcularPrecioSugerido(id: number) {
    return this.motoService.calcularPrecioSugerido(id);
  }
} 