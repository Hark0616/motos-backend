export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  direccion: string;
  createdAt?: Date;
  updatedAt?: Date;
} 