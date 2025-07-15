import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('NotificacionService');
  onModuleInit() {
    this.$connect();
  }

  async create(createNotificacionDto: CreateNotificacionDto) {
    return this.notificacion.create({
      data: {
        ...createNotificacionDto,
        fchEmision: new Date(),
        leida: false,
      },
    });
  }

  async findAll(leida?: boolean) {
    return this.notificacion.findMany({
      where: leida !== undefined ? { leida } : {},
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: {
        fchEmision: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.notificacion.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
  }

  async findByUsuario(usuarioId: number, leida?: boolean) {
    return this.notificacion.findMany({
      where: {
        usuarioId,
        leida: leida !== undefined ? leida : undefined,
      },
      orderBy: {
        fchEmision: 'desc',
      },
    });
  }

  async marcarComoLeida(id: number) {
    return this.notificacion.update({
      where: { id },
      data: { leida: true },
    });
  }

  async update(id: number, updateNotificacionDto: UpdateNotificacionDto) {
    return this.notificacion.update({
      where: { id },
      data: updateNotificacionDto,
    });
  }

  async remove(id: number) {
    return this.notificacion.delete({
      where: { id },
    });
  }

  async contarNoLeidas(usuarioId: number) {
    return this.notificacion.count({
      where: {
        usuarioId,
        leida: false,
      },
    });
  }
}