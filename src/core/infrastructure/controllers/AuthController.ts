import { Request, Response } from 'express';
import { AuthService } from '../../domain/services/AuthService';
import { PrismaClient } from '@prisma/client';

export class AuthController {
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Error en el login' });
    }
  }

  async crearUsuario(req: Request, res: Response) {
    try {
      const { email, password, nombre, apellido, rol } = req.body;
      const usuario = await this.authService.crearUsuario({
        email,
        password,
        nombre,
        apellido,
        rol
      });
      res.status(201).json(usuario);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear usuario' });
    }
  }

  async cambiarPassword(req: Request, res: Response) {
    try {
      const { nuevaPassword } = req.body;
      const usuarioId = req.user?.id;

      if (!usuarioId) {
        throw new Error('Usuario no autenticado');
      }

      await this.authService.cambiarPassword(usuarioId, nuevaPassword);
      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al cambiar contraseña' });
    }
  }

  async desactivarUsuario(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      await this.authService.desactivarUsuario(parseInt(usuarioId));
      res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al desactivar usuario' });
    }
  }
} 