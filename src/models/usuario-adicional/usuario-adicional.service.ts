import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUsuarioAdicionalDto } from './dto/create-usuario-adicional.dto';
import { UpdateUsuarioAdicionalDto } from './dto/update-usuario-adicional.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuarioAdicionalService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('UsuarioAdicionalService');
  onModuleInit() {
    this.$connect();
  }

  create(createUsuarioAdicionalDto: CreateUsuarioAdicionalDto) {
    return this.usuarioAdicional.create({
      data: createUsuarioAdicionalDto,
    });
  }

  findAll() {
    return this.usuarioAdicional.findMany({
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
    return this.usuarioAdicional.findUnique({
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
    return this.usuarioAdicional.findMany({
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
    return this.usuarioAdicional.findMany({
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
    updateUsuarioAdicionalDto: UpdateUsuarioAdicionalDto,
  ) {
    return this.usuarioAdicional.update({
      where: {
        usuarioId_clave: {
          usuarioId,
          clave,
        },
      },
      data: updateUsuarioAdicionalDto,
    });
  }

  async remove(usuarioId: number, clave: string) {
    return this.usuarioAdicional.delete({
      where: {
        usuarioId_clave: {
          usuarioId,
          clave,
        },
      },
    });
  }
}
