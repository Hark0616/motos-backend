import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

export function createAuthRoutes(prisma: PrismaClient) {
  const router = Router();
  const authController = new AuthController(prisma);
  const authMiddleware = new AuthMiddleware(prisma);

  // Rutas públicas
  router.post('/login', authController.login.bind(authController));

  // Rutas protegidas
  router.post('/usuarios',
    authMiddleware.verifyToken.bind(authMiddleware),
    authMiddleware.checkRole(['ADMIN']),
    authController.crearUsuario.bind(authController)
  );

  router.put('/usuarios/password',
    authMiddleware.verifyToken.bind(authMiddleware),
    authController.cambiarPassword.bind(authController)
  );

  router.put('/usuarios/:usuarioId/desactivar',
    authMiddleware.verifyToken.bind(authMiddleware),
    authMiddleware.checkRole(['ADMIN']),
    authController.desactivarUsuario.bind(authController)
  );

  return router;
} 