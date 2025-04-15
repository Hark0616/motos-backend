export interface Comision {
  id: number;
  monto: number;
  fecha: Date;
  pagado: boolean;
  fechaPago?: Date;
  motoId: number;
  ventaId?: number;
  notas?: string;
  moto?: {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    kilometraje: number;
    estado: string;
    precioCompra: number;
    precioVenta?: number;
  };
} 