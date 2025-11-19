import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAsistenteDto } from './dto/create-asistente.dto';
import { UpdateAsistenteDto } from './dto/update-asistente.dto';

@Injectable()
export class AsistenteService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('AsistenteService');
  onModuleInit() {
    this.$connect();
  }
  
  async create(createAsistenteDto: CreateAsistenteDto) {
    return this.asistente.create({
      data: createAsistenteDto,
    });
  }

  async findAll() {
    return this.asistente.findMany({
      include: {
        alerta: {
          select: {
            id: true,
            estado: true,
            fchEmision: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
      },
    });
  }

  async findOne(alertaId: number, usuarioId: number) {
    return this.asistente.findUnique({
      where: {
        alertaId_usuarioId: {
          alertaId,
          usuarioId,
        },
      },
      include: {
        alerta: true,
        usuario: true,
      },
    });
  }

  async findByAlerta(alertaId: number) {
    console.log('Fetching asistentes for alertaId:', alertaId);
    const asistentes = await this.asistente.findMany({
      where: { alertaId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
      },
    });
    console.log(`Found ${asistentes.length} asistentes for alertaId:`, alertaId);
    return asistentes;
  }

  async findByUsuario(usuarioId: number) {
    return this.asistente.findMany({
      where: { usuarioId },
      include: {
        alerta: {
          select: {
            id: true,
            estado: true,
            fchEmision: true,
          },
        },
      },
    });
  }

  async update(
    alertaId: number,
    usuarioId: number,
    updateAsistenteDto: UpdateAsistenteDto,
  ) {
    return this.asistente.update({
      where: {
        alertaId_usuarioId: {
          alertaId,
          usuarioId,
        },
      },
      data: updateAsistenteDto,
    });
  }

  async remove(alertaId: number, usuarioId: number) {
    return this.asistente.delete({
      where: {
        alertaId_usuarioId: {
          alertaId,
          usuarioId,
        },
      },
    });
  }
}