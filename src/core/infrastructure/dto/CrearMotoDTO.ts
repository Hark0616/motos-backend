import { z } from 'zod';

export const crearMotoSchema = z.object({
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  año: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  kilometraje: z.number().int().min(0),
  estado: z.enum(["EN_EVALUACION", "EN_REPARACION", "DISPONIBLE", "VENDIDA", "RESERVADA"]),
  precioCompra: z.number().positive("El precio de compra debe ser positivo"),
  precioVenta: z.number().positive("El precio de venta debe ser positivo").optional(),
  descripcion: z.string().optional(),
  fotos: z.array(z.string().url()).optional(),
  documentos: z.object({
    matricula: z.string().optional(),
    soat: z.string().optional(),
    revisionTecnica: z.string().optional()
  }).optional(),
  reparaciones: z.array(z.object({
    descripcion: z.string(),
    costo: z.number().positive(),
    fecha: z.date()
  })).optional()
});

export type CrearMotoDTO = z.infer<typeof crearMotoSchema>; 