export class CrearMotoDTO {
  marca: string;
  modelo: string;
  año: number;
  kilometraje: number;
  precioCompra: number;
  descripcion?: string;
  fotos?: string[];
  documentos?: {
    matricula?: string;
    soat?: string;
    revisionTecnica?: string;
  };
} 