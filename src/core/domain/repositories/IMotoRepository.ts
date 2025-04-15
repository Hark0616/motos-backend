import { Moto } from '../entities/Moto';

export interface IMotoRepository {
  create(data: {
    marca: string;
    modelo: string;
    año: number;
    kilometraje: number;
    estado: string;
    precioCompra: number;
    precioVenta?: number;
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
  }): Promise<any>;

  update(id: number, data: Partial<{
    marca: string;
    modelo: string;
    año: number;
    kilometraje: number;
    estado: string;
    precioCompra: number;
    precioVenta: number;
    descripcion: string;
    fotos: string[];
    documentos: {
      matricula?: string;
      soat?: string;
      revisionTecnica?: string;
    };
    reparaciones: {
      descripcion: string;
      costo: number;
      fecha: Date;
    }[];
  }>): Promise<any>;

  findById(id: number): Promise<any>;
  findAll(): Promise<any[]>;
  findByEstado(estado: string): Promise<any[]>;
  findByMarca(marca: string): Promise<any[]>;
  findByPrecioRange(min: number, max: number): Promise<any[]>;
  addReparacion(motoId: number, reparacion: {
    descripcion: string;
    costo: number;
    fecha: Date;
  }): Promise<any>;
  updateEstado(motoId: number, estado: string): Promise<any>;
} 