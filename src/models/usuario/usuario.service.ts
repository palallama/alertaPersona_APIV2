import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsuarioService extends PrismaClient implements OnModuleInit {

  constructor(private mailService: MailService) {
    super();
  }

  private readonly logger = new Logger('UsuarioService');
  onModuleInit() {
    this.$connect();
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    return this.usuario.create({
      data: {
        ...createUsuarioDto,
        password: hashedPassword,
        fechaCreacion: new Date(),
      },
    });
  }

  async findAll(activo?: boolean) {
    return this.usuario.findMany({
      where: activo !== undefined ? { activo } : {},
    });
  }

  async findOne(id: number) {
    return this.usuario.findUnique({
      where: { id },
    });
  }

  // async findByDocumento(nroDocumento: string) {
  //   return this.usuario.findUnique({
  //     where: { nroDocumento },
  //   });
  // }

  async findByEmail(mail: string) {
    return this.usuario.findUnique({
      where: { mail },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuario.update({
      where: { id },
      data: {
        ...updateUsuarioDto,
        ultimoAcceso: new Date(),
      },
    });
  }

  async remove(id: number) {
    // Borrado lógico
    return this.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }

  async loginUser(mail: string) {
    const  user = await this.findByEmail(mail);
    if (user){
      await this.usuario.update({
        where: { id: user.id },
        data: {
          ultimoAcceso: new Date(),
        },
      })

      // this.mailService.recuperoPassword(user, '123456');
    }
    return user;
  }

  async obtenerHistorialAlertas(usuarioId: number) {
    // 1. Obtener alertas emitidas por el usuario
    const alertasEmitidas = await this.alerta.findMany({
      where: { usuarioId },
      include: {
        asistentes: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
              },
            },
          },
        },
      },
      orderBy: { fchEmision: 'desc' },
    });
  
    // 2. Obtener alertas donde el usuario asistió
    const alertasAsistidas = await this.asistente.findMany({
      where: { usuarioId },
      include: {
        alerta: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
              },
            },
          },
        },
      },
      orderBy: { alerta: { fchEmision: 'desc' } },
    });
  
    return {
      emitidas: alertasEmitidas.map(alerta => ({
        ...alerta,
        tipo: 'emitida',
      })),
      asistidas: alertasAsistidas.map(asistencia => ({
        ...asistencia.alerta,
        tipo: 'asistida',
        estadoAsistencia: asistencia.estado,
        observacionAsistencia: asistencia.observacion,
      })),
    };
  }

  async actualizarContrasena(usuarioId: number, nuevaContrasenaHash: string) {
    return this.usuario.update({
      where: { id: usuarioId },
      data: { password: nuevaContrasenaHash },
    });
  }
}