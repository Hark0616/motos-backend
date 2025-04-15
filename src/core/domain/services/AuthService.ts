import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email, activo: true }
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      this.jwtSecret,
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
      }
    };
  }

  async crearUsuario(data: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    rol: Rol;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.usuario.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  async cambiarPassword(usuarioId: number, nuevaPassword: string) {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    return this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: hashedPassword }
    });
  }

  async desactivarUsuario(usuarioId: number) {
    return this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { activo: false }
    });
  }

  async verificarToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        id: number;
        email: string;
        rol: Rol;
      };

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: decoded.id, activo: true }
      });

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
} 