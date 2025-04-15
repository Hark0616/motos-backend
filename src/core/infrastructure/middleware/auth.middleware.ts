import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../domain/services/AuthService';
import { PrismaClient } from '@prisma/client';

export class AuthMiddleware {
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
  }

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = await this.authService.verificarToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  }

  checkRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'No autorizado' });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
      }

      next();
    };
  }
} 