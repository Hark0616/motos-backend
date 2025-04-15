export enum EstadoMoto {
  EN_EVALUACION = 'EN_EVALUACION',
  EN_REPARACION = 'EN_REPARACION',
  DISPONIBLE = 'DISPONIBLE',
  VENDIDA = 'VENDIDA',
  RESERVADA = 'RESERVADA'
}

export class Moto {
  id?: string;
  marca: string;
  modelo: string;
  año: number;
  kilometraje: number;
  estado: EstadoMoto;
  precioCompra: number;
  precioVenta?: number;
  fechaCompra: Date;
  fechaVenta?: Date;
  clienteActualId?: string;
  descripcion?: string;
  fotos?: string[];
  documentos?: {
    matricula?: string;
    soat?: string;
    revisionTecnica?: string;
  };
  reparaciones?: {
    descripcion: string;
    costo: number;
    fecha: Date;
  }[];

  constructor(data: Partial<Moto>) {
    Object.assign(this, data);
  }

  calcularPrecioSugerido(): number {
    const costoBase = this.precioCompra;
    const costoReparaciones = this.reparaciones?.reduce((acc, rep) => acc + rep.costo, 0) || 0;
    const margenGanancia = 0.15; // 15% de margen
    return (costoBase + costoReparaciones) * (1 + margenGanancia);
  }

  cambiarEstado(nuevoEstado: EstadoMoto): void {
    this.estado = nuevoEstado;
  }

  agregarReparacion(descripcion: string, costo: number): void {
    this.reparaciones = this.reparaciones || [];
    this.reparaciones.push({
      descripcion,
      costo,
      fecha: new Date()
    });
  }
} 