import { Request, Response } from 'express';
import { MotoApplicationService } from '../../application/services/MotoApplicationService';
import { CrearMotoDTO } from '../../application/dtos/CrearMotoDTO';
import { EstadoMoto } from '../../domain/entities/Moto';

export class MotoController {
  constructor(private motoApplicationService: MotoApplicationService) {}

  async crearMoto(req: Request, res: Response) {
    try {
      const dto: CrearMotoDTO = req.body;
      const moto = await this.motoApplicationService.crearMoto(dto);
      res.status(201).json(moto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async actualizarMoto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: Partial<CrearMotoDTO> = req.body;
      const moto = await this.motoApplicationService.actualizarMoto(id, dto);
      res.json(moto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const moto = await this.motoApplicationService.cambiarEstado(id, estado as EstadoMoto);
      res.json(moto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async agregarReparacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descripcion, costo } = req.body;
      const moto = await this.motoApplicationService.agregarReparacion(id, descripcion, costo);
      res.json(moto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async calcularPrecioSugerido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const precio = await this.motoApplicationService.calcularPrecioSugerido(id);
      res.json({ precioSugerido: precio });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
} 