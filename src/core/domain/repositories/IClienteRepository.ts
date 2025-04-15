import { Cliente } from '@prisma/client';

export interface IClienteRepository {
  create(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente>;
  update(id: number, cliente: Partial<Cliente>): Promise<Cliente>;
  findById(id: number): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  findByCedula(cedula: string): Promise<Cliente | null>;
  findByNombre(nombre: string): Promise<Cliente[]>;
  findByApellido(apellido: string): Promise<Cliente[]>;
  getHistorialCompras(clienteId: number): Promise<any[]>;
  getHistorialVentas(clienteId: number): Promise<any[]>;
} 