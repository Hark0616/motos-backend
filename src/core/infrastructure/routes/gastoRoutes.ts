import { Router } from 'express';
import { GastoController } from '../controllers/GastoController';
import { GastoService } from '../../domain/services/GastoService';
import { PrismaGastoRepository } from '../persistence/PrismaGastoRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const gastoRepository = new PrismaGastoRepository(prisma);
const gastoService = new GastoService(gastoRepository);
const gastoController = new GastoController(gastoService);

// Crear un nuevo gasto
router.post('/', gastoController.crearGasto.bind(gastoController));

// Actualizar un gasto existente
router.put('/:id', gastoController.actualizarGasto.bind(gastoController));

// Marcar un gasto como pagado
router.patch('/:id/pagar', gastoController.marcarComoPagado.bind(gastoController));

// Obtener gastos por moto
router.get('/moto/:motoId', gastoController.obtenerGastosPorMoto.bind(gastoController));

// Obtener gastos por tipo
router.get('/tipo/:tipo', gastoController.obtenerGastosPorTipo.bind(gastoController));

// Obtener gastos pendientes
router.get('/pendientes', gastoController.obtenerGastosPendientes.bind(gastoController));

export default router; 