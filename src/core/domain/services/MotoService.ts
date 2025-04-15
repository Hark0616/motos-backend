import { IMotoRepository } from '../repositories/IMotoRepository';

export class MotoService {
  constructor(private motoRepository: IMotoRepository) {}

  async crearMoto(data: {
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
  }) {
    // Validar que el estado inicial sea EN_EVALUACION
    if (data.estado !== "EN_EVALUACION") {
      throw new Error("El estado inicial debe ser EN_EVALUACION");
    }

    // Validar que no se incluya precioVenta en la creación
    if (data.precioVenta) {
      throw new Error("No se puede establecer el precio de venta al crear la moto");
    }

    return this.motoRepository.create(data);
  }

  async actualizarMoto(id: number, data: Partial<{
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
  }>) {
    const moto = await this.motoRepository.findById(id);
    if (!moto) {
      throw new Error("Moto no encontrada");
    }

    // Validar transiciones de estado
    if (data.estado) {
      this.validarTransicionEstado(moto.estado, data.estado);
    }

    return this.motoRepository.update(id, data);
  }

  async obtenerMoto(id: number) {
    const moto = await this.motoRepository.findById(id);
    if (!moto) {
      throw new Error("Moto no encontrada");
    }
    return moto;
  }

  async listarMotos() {
    return this.motoRepository.findAll();
  }

  async listarMotosPorEstado(estado: string) {
    return this.motoRepository.findByEstado(estado);
  }

  async listarMotosPorMarca(marca: string) {
    return this.motoRepository.findByMarca(marca);
  }

  async listarMotosPorPrecio(min: number, max: number) {
    return this.motoRepository.findByPrecioRange(min, max);
  }

  async agregarReparacion(motoId: number, reparacion: {
    descripcion: string;
    costo: number;
    fecha: Date;
  }) {
    const moto = await this.motoRepository.findById(motoId);
    if (!moto) {
      throw new Error("Moto no encontrada");
    }

    // Validar que la moto esté en estado EN_REPARACION
    if (moto.estado !== "EN_REPARACION") {
      throw new Error("Solo se pueden agregar reparaciones a motos en estado EN_REPARACION");
    }

    return this.motoRepository.addReparacion(motoId, reparacion);
  }

  async cambiarEstado(motoId: number, nuevoEstado: string) {
    const moto = await this.motoRepository.findById(motoId);
    if (!moto) {
      throw new Error("Moto no encontrada");
    }

    this.validarTransicionEstado(moto.estado, nuevoEstado);
    return this.motoRepository.updateEstado(motoId, nuevoEstado);
  }

  private validarTransicionEstado(estadoActual: string, nuevoEstado: string) {
    const transicionesValidas: { [key: string]: string[] } = {
      "EN_EVALUACION": ["EN_REPARACION", "DISPONIBLE"],
      "EN_REPARACION": ["DISPONIBLE"],
      "DISPONIBLE": ["RESERVADA", "VENDIDA"],
      "RESERVADA": ["DISPONIBLE", "VENDIDA"],
      "VENDIDA": []
    };

    if (!transicionesValidas[estadoActual]?.includes(nuevoEstado)) {
      throw new Error(`Transición de estado inválida: de ${estadoActual} a ${nuevoEstado}`);
    }
  }
} 