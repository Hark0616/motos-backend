import { TipoGasto } from '../../domain/entities/TipoGasto';
import { z } from 'zod';

// Esquema de validación con Zod
export const actualizarGastoSchema = z.object({
  tipo: z.nativeEnum(TipoGasto).optional(),
  descripcion: z.string().optional(),
  monto: z.number().positive().optional(),
  motoId: z.number().optional(),
  comprobante: z.string().url().optional(),
  notas: z.string().optional(),
  pagado: z.boolean().optional(),
  fechaPago: z.date().optional()
});

// Tipo TypeScript basado en el esquema
export type ActualizarGastoDTO = z.infer<typeof actualizarGastoSchema>; 