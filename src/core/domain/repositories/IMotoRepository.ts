import { Moto } from '../entities/Moto';

export interface IMotoRepository {
  create(moto: Moto): Promise<Moto>;
  update(id: string, moto: Partial<Moto>): Promise<Moto>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Moto | null>;
  findAll(): Promise<Moto[]>;
  findByEstado(estado: string): Promise<Moto[]>;
  findByCliente(clienteId: string): Promise<Moto[]>;
} 