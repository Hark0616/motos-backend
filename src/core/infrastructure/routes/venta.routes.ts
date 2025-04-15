import { Router } from 'express';
import { VentaController } from '../controllers/VentaController';
import { VentaService } from '../../domain/services/VentaService';
import { PrismaVentaRepository } from '../persistence/PrismaVentaRepository';
import { PrismaClient } from '@prisma/client';
import { AuthMiddleware } from '../middleware/auth.middleware';

export const createVentaRoutes = (prisma: PrismaClient) => {
  const router = Router();
  const ventaRepository = new PrismaVentaRepository(prisma);
  const ventaService = new VentaService(ventaRepository);
  const ventaController = new VentaController(ventaService);
  const authMiddleware = new AuthMiddleware(prisma);

  // Rutas protegidas que requieren autenticación
  router.use(authMiddleware.verifyToken);

  // Crear venta (solo ADMIN y VENDEDOR)
  router.post('/', 
    authMiddleware.checkRole(['ADMIN', 'VENDEDOR']), 
    ventaController.crearVenta.bind(ventaController)
  );

  // Obtener una venta específica
  router.get('/:id', ventaController.obtenerVenta.bind(ventaController));

  // Listar todas las ventas
  router.get('/', ventaController.listarVentas.bind(ventaController));

  // Obtener ventas por cliente
  router.get('/cliente/:clienteId', ventaController.obtenerVentasPorCliente.bind(ventaController));

  // Obtener ventas por moto
  router.get('/moto/:motoId', ventaController.obtenerVentasPorMoto.bind(ventaController));

  // Obtener ventas por rango de fechas
  router.get('/fecha', ventaController.obtenerVentasPorFecha.bind(ventaController));

  // Actualizar estado de traspaso (solo ADMIN y VENDEDOR)
  router.put('/:id/traspaso', 
    authMiddleware.checkRole(['ADMIN', 'VENDEDOR']),
    ventaController.actualizarEstadoTraspaso.bind(ventaController)
  );

  // Calcular ganancias (solo ADMIN)
  router.get('/reportes/ganancias', 
    authMiddleware.checkRole(['ADMIN']),
    ventaController.calcularGanancias.bind(ventaController)
  );

  // Generar reporte de ventas (solo ADMIN)
  router.get('/reportes/general', 
    authMiddleware.checkRole(['ADMIN']),
    ventaController.generarReporteVentas.bind(ventaController)
  );

  // Obtener comisiones por venta
  router.get('/:id/comisiones', ventaController.obtenerComisionesPorVenta.bind(ventaController));

  return router;
}; 