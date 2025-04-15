import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { PrismaClient } from '@prisma/client';
import { AuthMiddleware } from '../middleware/auth.middleware';

export function createClienteRoutes(clienteController: ClienteController) {
  const router = Router();
  const prisma = new PrismaClient();
  const authMiddleware = new AuthMiddleware(prisma);

  // Middleware de autenticación para todas las rutas
  router.use(authMiddleware.verifyToken.bind(authMiddleware));

  // Rutas de clientes
  router.post('/', 
    authMiddleware.checkRole(['ADMIN', 'VENDEDOR']),
    clienteController.crearCliente.bind(clienteController)
  );

  router.put('/:id',
    authMiddleware.checkRole(['ADMIN', 'VENDEDOR']),
    clienteController.actualizarCliente.bind(clienteController)
  );

  router.get('/:id', clienteController.obtenerCliente.bind(clienteController));
  router.get('/', clienteController.listarClientes.bind(clienteController));
  router.get('/buscar', clienteController.buscarClientes.bind(clienteController));
  router.get('/:id/historial', clienteController.obtenerHistorialCliente.bind(clienteController));

  return router;
} 