import { TipoGasto } from '../../domain/entities/TipoGasto';
import { z } from 'zod';

// Esquema de validación con Zod
export const crearGastoSchema = z.object({
  tipo: z.nativeEnum(TipoGasto),
  descripcion: z.string().optional(),
  monto: z.number().positive(),
  motoId: z.number().optional(),
  comprobante: z.string().url().optional(),
  notas: z.string().optional()
});

// Tipo TypeScript basado en el esquema
export type CrearGastoDTO = z.infer<typeof crearGastoSchema>; 