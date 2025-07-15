import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUsuarioPreferenciaDto } from './dto/create-usuario-preferencia.dto';
import { UpdateUsuarioPreferenciaDto } from './dto/update-usuario-preferencia.dto';

@Injectable()
export class UsuarioPreferenciaService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('UsuarioParametroService');
  onModuleInit() {
    this.$connect();
  }

  async create(createUsuarioPreferenciaDto: CreateUsuarioPreferenciaDto) {
    return this.usuarioPreferencia.create({
      data: createUsuarioPreferenciaDto,
    });
  }

  async findAll() {
    return this.usuarioPreferencia.findMany({
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

  async findOne(usuarioId: number, clave: string) {
    return this.usuarioPreferencia.findUnique({
      where: {
        usuarioId_clave: {
          usuarioId,
          clave,
        },
      },
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

  async findByUsuario(usuarioId: number) {
    return this.usuarioPreferencia.findMany({
      where: { usuarioId },
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

  async findByClave(clave: string) {
    return this.usuarioPreferencia.findMany({
      where: { clave },
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

  async update(
    usuarioId: number,
    clave: string,
    updateUsuarioPreferenciaDto: UpdateUsuarioPreferenciaDto,
  ) {
    return this.usuarioPreferencia.update({
      where: {
        usuarioId_clave: {
          usuarioId,
          clave,
        },
      },
      data: updateUsuarioPreferenciaDto,
    });
  }

  async remove(usuarioId: number, clave: string) {
    return this.usuarioPreferencia.delete({
      where: {
        usuarioId_clave: {
          usuarioId,
          clave,
        },
      },
    });
  }

  async setDelUsuarioPreferencia(usuarioId: number, clave: string) {
    const pref = await this.findOne(usuarioId, clave);
    if (pref) {
      return this.remove(usuarioId, clave);
    } else {
      return this.create({
        usuarioId,
        clave,
      });
    }
  }
}