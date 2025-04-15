import { Request, Response } from 'express';
import { GastoService } from '../../domain/services/GastoService';
import { TipoGasto } from '../../domain/entities/TipoGasto';
import { crearGastoSchema, CrearGastoDTO } from '../dto/CrearGastoDTO';
import { actualizarGastoSchema, ActualizarGastoDTO } from '../dto/ActualizarGastoDTO';

export class GastoController {
  constructor(private gastoService: GastoService) {}

  async crearGasto(req: Request, res: Response) {
    try {
      // Validar y parsear los datos de entrada
      const validatedData = crearGastoSchema.parse(req.body);
      
      const gasto = await this.gastoService.crearGasto(validatedData);
      return res.status(201).json(gasto);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async actualizarGasto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Validar y parsear los datos de entrada
      const validatedData = actualizarGastoSchema.parse(req.body);

      const gasto = await this.gastoService.actualizarGasto(Number(id), validatedData);
      return res.status(200).json(gasto);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async marcarComoPagado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gasto = await this.gastoService.marcarComoPagado(Number(id));
      return res.status(200).json(gasto);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async obtenerGastosPorMoto(req: Request, res: Response) {
    try {
      const { motoId } = req.params;
      const gastos = await this.gastoService.obtenerGastosPorMoto(Number(motoId));
      return res.status(200).json(gastos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async obtenerGastosPorTipo(req: Request, res: Response) {
    try {
      const { tipo } = req.params;
      const gastos = await this.gastoService.obtenerGastosPorTipo(tipo as TipoGasto);
      return res.status(200).json(gastos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async obtenerGastosPendientes(req: Request, res: Response) {
    try {
      const gastos = await this.gastoService.obtenerGastosPendientes();
      return res.status(200).json(gastos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
} 