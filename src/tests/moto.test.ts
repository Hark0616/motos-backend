import { PrismaClient } from '@prisma/client';
import { MotoService } from '../core/domain/services/MotoService';
import { PrismaMotoRepository } from '../core/infrastructure/persistence/PrismaMotoRepository';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

describe('MotoService', () => {
  let prisma: PrismaClient;
  let motoService: MotoService;
  let motoRepository: PrismaMotoRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    motoRepository = new PrismaMotoRepository(prisma);
    motoService = new MotoService(motoRepository);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada prueba
    await prisma.moto.deleteMany();
  });

  describe('crearMoto', () => {
    it('debería crear una moto correctamente', async () => {
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'EN_EVALUACION',
        precioCompra: 15000,
        descripcion: 'Moto en excelente estado',
        fotos: ['https://example.com/foto1.jpg'],
        documentos: {
          matricula: 'ABC123',
          soat: 'SOAT123',
          revisionTecnica: 'RT123'
        }
      };

      const moto = await motoService.crearMoto(motoData);

      expect(moto).toBeDefined();
      expect(moto.marca).toBe(motoData.marca);
      expect(moto.modelo).toBe(motoData.modelo);
      expect(moto.estado).toBe('EN_EVALUACION');
      expect(moto.precioVenta).toBeNull();
    });

    it('debería lanzar error si el estado inicial no es EN_EVALUACION', async () => {
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'DISPONIBLE', // Estado incorrecto
        precioCompra: 15000
      };

      await expect(motoService.crearMoto(motoData)).rejects.toThrow(
        'El estado inicial debe ser EN_EVALUACION'
      );
    });

    it('debería lanzar error si se intenta establecer precioVenta al crear', async () => {
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'EN_EVALUACION',
        precioCompra: 15000,
        precioVenta: 18000 // No debería permitirse
      };

      await expect(motoService.crearMoto(motoData)).rejects.toThrow(
        'No se puede establecer el precio de venta al crear la moto'
      );
    });
  });

  describe('actualizarMoto', () => {
    it('debería actualizar una moto correctamente', async () => {
      // Primero creamos una moto
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'EN_EVALUACION',
        precioCompra: 15000
      };

      const moto = await motoService.crearMoto(motoData);

      // Actualizamos la moto
      const updateData = {
        estado: 'EN_REPARACION',
        descripcion: 'Moto en reparación'
      };

      const motoActualizada = await motoService.actualizarMoto(moto.id, updateData);

      expect(motoActualizada.estado).toBe('EN_REPARACION');
      expect(motoActualizada.descripcion).toBe('Moto en reparación');
    });

    it('debería validar las transiciones de estado', async () => {
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'EN_EVALUACION',
        precioCompra: 15000
      };

      const moto = await motoService.crearMoto(motoData);

      // Intentar una transición inválida
      await expect(
        motoService.actualizarMoto(moto.id, { estado: 'VENDIDA' })
      ).rejects.toThrow('Transición de estado inválida');
    });
  });

  describe('agregarReparacion', () => {
    it('debería agregar una reparación correctamente', async () => {
      // Crear una moto en estado EN_REPARACION
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'EN_EVALUACION',
        precioCompra: 15000
      };

      const moto = await motoService.crearMoto(motoData);
      await motoService.actualizarMoto(moto.id, { estado: 'EN_REPARACION' });

      const reparacion = {
        descripcion: 'Cambio de aceite y filtro',
        costo: 150,
        fecha: new Date()
      };

      const motoConReparacion = await motoService.agregarReparacion(moto.id, reparacion);

      expect(motoConReparacion.reparaciones).toBeDefined();
      const reparaciones = JSON.parse(motoConReparacion.reparaciones as string);
      expect(reparaciones).toHaveLength(1);
      expect(reparaciones[0].descripcion).toBe(reparacion.descripcion);
    });

    it('debería lanzar error si la moto no está en estado EN_REPARACION', async () => {
      const motoData = {
        marca: 'Honda',
        modelo: 'CBR600RR',
        año: 2020,
        kilometraje: 5000,
        estado: 'EN_EVALUACION',
        precioCompra: 15000
      };

      const moto = await motoService.crearMoto(motoData);

      const reparacion = {
        descripcion: 'Cambio de aceite',
        costo: 150,
        fecha: new Date()
      };

      await expect(
        motoService.agregarReparacion(moto.id, reparacion)
      ).rejects.toThrow('Solo se pueden agregar reparaciones a motos en estado EN_REPARACION');
    });
  });
}); 