import { Request, Response } from 'express';
import { VentaService } from '../../domain/services/VentaService';
import { PrismaClient } from '@prisma/client';
import { PrismaVentaRepository } from '../persistence/PrismaVentaRepository';

export class VentaController {
  private ventaService: VentaService;

  constructor(prisma: PrismaClient) {
    const ventaRepository = new PrismaVentaRepository(prisma);
    this.ventaService = new VentaService(ventaRepository);
  }

  async crearVenta(req: Request, res: Response) {
    try {
      const venta = await this.ventaService.crearVenta(req.body);
      res.status(201).json(venta);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear venta' });
    }
  }

  async obtenerVenta(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const venta = await this.ventaService.obtenerVenta(parseInt(id));
      res.json(venta);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Venta no encontrada' });
    }
  }

  async listarVentas(req: Request, res: Response) {
    try {
      const ventas = await this.ventaService.listarVentas();
      res.json(ventas);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al listar ventas' });
    }
  }

  async obtenerVentasPorCliente(req: Request, res: Response) {
    try {
      const { clienteId } = req.params;
      const ventas = await this.ventaService.obtenerVentasPorCliente(parseInt(clienteId));
      res.json(ventas);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener ventas del cliente' });
    }
  }

  async obtenerVentasPorMoto(req: Request, res: Response) {
    try {
      const { motoId } = req.params;
      const ventas = await this.ventaService.obtenerVentasPorMoto(parseInt(motoId));
      res.json(ventas);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener ventas de la moto' });
    }
  }

  async obtenerVentasPorFecha(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin || typeof fechaInicio !== 'string' || typeof fechaFin !== 'string') {
        return res.status(400).json({ error: 'Fechas inválidas' });
      }
      const ventas = await this.ventaService.obtenerVentasPorFecha(
        new Date(fechaInicio),
        new Date(fechaFin)
      );
      res.json(ventas);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener ventas por fecha' });
    }
  }

  async actualizarEstadoTraspaso(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const venta = await this.ventaService.actualizarEstadoTraspaso(parseInt(id), estado);
      res.json(venta);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al actualizar estado de traspaso' });
    }
  }

  async calcularGanancias(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin || typeof fechaInicio !== 'string' || typeof fechaFin !== 'string') {
        return res.status(400).json({ error: 'Fechas inválidas' });
      }
      const ganancias = await this.ventaService.calcularGanancias(
        new Date(fechaInicio),
        new Date(fechaFin)
      );
      res.json(ganancias);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al calcular ganancias' });
    }
  }

  async generarReporteVentas(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin || typeof fechaInicio !== 'string' || typeof fechaFin !== 'string') {
        return res.status(400).json({ error: 'Fechas inválidas' });
      }
      const reporte = await this.ventaService.generarReporteVentas(
        new Date(fechaInicio),
        new Date(fechaFin)
      );
      res.json(reporte);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al generar reporte de ventas' });
    }
  }

  async obtenerComisionesPorVenta(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comisiones = await this.ventaService.obtenerComisionesPorVenta(parseInt(id));
      res.json(comisiones);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Error al obtener comisiones' });
    }
  }
} 