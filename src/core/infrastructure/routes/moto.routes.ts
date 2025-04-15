import { Router } from 'express';
import { MotoController } from '../controllers/MotoController';

export const createMotoRoutes = (motoController: MotoController) => {
  const router = Router();

  router.post('/', (req, res) => motoController.crearMoto(req, res));
  router.put('/:id', (req, res) => motoController.actualizarMoto(req, res));
  router.patch('/:id/estado', (req, res) => motoController.cambiarEstado(req, res));
  router.post('/:id/reparaciones', (req, res) => motoController.agregarReparacion(req, res));
  router.get('/:id/precio-sugerido', (req, res) => motoController.calcularPrecioSugerido(req, res));

  return router;
}; 