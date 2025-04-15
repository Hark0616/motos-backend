import { Request, Response } from 'express';
import { MotoApplicationService } from '../../../application/services/MotoApplicationService';

export class MotoController {
  constructor(private motoApplicationService: MotoApplicationService) {}

  async crearMoto(req: Request, res: Response) {
    try {
      const moto = await this.motoApplicationService.crearMoto(req.body);
      res.status(201).json(moto);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al crear la moto' });
    }
  }

  async actualizarMoto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const moto = await this.motoApplicationService.actualizarMoto(Number(id), req.body);
      res.json(moto);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al actualizar la moto' });
    }
  }

  async obtenerMoto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const moto = await this.motoApplicationService.obtenerMoto(Number(id));
      res.json(moto);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener la moto' });
    }
  }

  async obtenerTodas(req: Request, res: Response) {
    try {
      const motos = await this.motoApplicationService.obtenerTodas();
      res.json(motos);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener las motos' });
    }
  }

  async obtenerPorEstado(req: Request, res: Response) {
    try {
      const { estado } = req.params;
      const motos = await this.motoApplicationService.obtenerPorEstado(estado);
      res.json(motos);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener las motos por estado' });
    }
  }

  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const moto = await this.motoApplicationService.cambiarEstado(Number(id), estado);
      res.json(moto);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al cambiar el estado de la moto' });
    }
  }

  async agregarReparacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reparacion = req.body;
      const moto = await this.motoApplicationService.agregarReparacion(Number(id), reparacion);
      res.json(moto);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al agregar la reparación' });
    }
  }

  async calcularPrecioSugerido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const precio = await this.motoApplicationService.calcularPrecioSugerido(Number(id));
      res.json({ precioSugerido: precio });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al calcular el precio sugerido' });
    }
  }
} 