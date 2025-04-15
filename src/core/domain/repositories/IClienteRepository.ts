import { Cliente } from '../entities/Cliente';

export interface IClienteRepository {
  create(cliente: Cliente): Promise<Cliente>;
  update(id: number, cliente: Partial<Cliente>): Promise<Cliente>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  findByCedula(cedula: string): Promise<Cliente | null>;
  findByEmail(email: string): Promise<Cliente | null>;
  findByNombre(nombre: string): Promise<Cliente[]>;
  findByApellido(apellido: string): Promise<Cliente[]>;
  search(query: string): Promise<Cliente[]>;
  getHistorialCompras(clienteId: number): Promise<any[]>;
  getHistorialVentas(clienteId: number): Promise<any[]>;
} 