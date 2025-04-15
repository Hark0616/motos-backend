import { Request, Response } from 'express';
import { ClienteService } from '../../domain/services/ClienteService';
import { PrismaClient } from '@prisma/client';
import { PrismaClienteRepository } from '../persistence/PrismaClienteRepository';

export class ClienteController {
  private clienteService: ClienteService;

  constructor(prisma: PrismaClient) {
    const clienteRepository = new PrismaClienteRepository(prisma);
    this.clienteService = new ClienteService(clienteRepository);
  }

  async crearCliente(req: Request, res: Response) {
    try {
      const cliente = await this.clienteService.crearCliente(req.body);
      res.status(201).json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear cliente' });
    }
  }

  async actualizarCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.actualizarCliente(parseInt(id), req.body);
      res.json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al actualizar cliente' });
    }
  }

  async obtenerCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.obtenerCliente(parseInt(id));
      res.json(cliente);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Cliente no encontrado' });
    }
  }

  async listarClientes(req: Request, res: Response) {
    try {
      const clientes = await this.clienteService.listarClientes();
      res.json(clientes);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al listar clientes' });
    }
  }

  async buscarClientes(req: Request, res: Response) {
    try {
      const { termino } = req.query;
      if (!termino || typeof termino !== 'string') {
        return res.status(400).json({ error: 'Término de búsqueda inválido' });
      }
      const clientes = await this.clienteService.buscarClientes(termino);
      res.json(clientes);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al buscar clientes' });
    }
  }

  async obtenerHistorialCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const historial = await this.clienteService.obtenerHistorialCliente(parseInt(id));
      res.json(historial);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Error al obtener historial del cliente' });
    }
  }
} 