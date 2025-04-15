import { TipoGasto } from '../entities/TipoGasto';

export interface IGastoRepository {
  create(data: {
    tipo: TipoGasto;
    descripcion?: string;
    monto: number;
    motoId?: number;
    comprobante?: string;
    notas?: string;
  }): Promise<any>;

  update(id: number, data: Partial<{
    tipo: TipoGasto;
    descripcion: string;
    monto: number;
    motoId: number;
    comprobante: string;
    notas: string;
    pagado: boolean;
    fechaPago: Date;
  }>): Promise<any>;

  findById(id: number): Promise<any>;
  findByMotoId(motoId: number): Promise<any[]>;
  findByTipo(tipo: TipoGasto): Promise<any[]>;
  findByPagado(pagado: boolean): Promise<any[]>;
} 