import { IClienteRepository } from '../repositories/IClienteRepository';
import { Cliente } from '@prisma/client';

export class ClienteService {
  constructor(private clienteRepository: IClienteRepository) {}

  async crearCliente(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    // Validar que la cédula no exista
    const clienteExistente = await this.clienteRepository.findByCedula(cliente.cedula);
    if (clienteExistente) {
      throw new Error('Ya existe un cliente con esta cédula');
    }

    return this.clienteRepository.create(cliente);
  }

  async actualizarCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const clienteExistente = await this.clienteRepository.findById(id);
    if (!clienteExistente) {
      throw new Error('Cliente no encontrado');
    }

    // Si se está actualizando la cédula, verificar que no exista otro cliente con la misma
    if (cliente.cedula && cliente.cedula !== clienteExistente.cedula) {
      const clienteConCedula = await this.clienteRepository.findByCedula(cliente.cedula);
      if (clienteConCedula) {
        throw new Error('Ya existe un cliente con esta cédula');
      }
    }

    return this.clienteRepository.update(id, cliente);
  }

  async obtenerCliente(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  async listarClientes(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }

  async buscarClientes(termino: string): Promise<Cliente[]> {
    const clientesPorNombre = await this.clienteRepository.findByNombre(termino);
    const clientesPorApellido = await this.clienteRepository.findByApellido(termino);
    
    // Combinar y eliminar duplicados
    const clientesUnicos = new Map<number, Cliente>();
    [...clientesPorNombre, ...clientesPorApellido].forEach(cliente => {
      clientesUnicos.set(cliente.id, cliente);
    });

    return Array.from(clientesUnicos.values());
  }

  async obtenerHistorialCliente(clienteId: number): Promise<{
    compras: any[];
    ventas: any[];
  }> {
    const [compras, ventas] = await Promise.all([
      this.clienteRepository.getHistorialCompras(clienteId),
      this.clienteRepository.getHistorialVentas(clienteId)
    ]);

    return { compras, ventas };
  }
} 