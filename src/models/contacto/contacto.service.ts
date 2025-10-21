import { Injectable, Logger, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { ResponderSolicitudContactoDto } from './dto/responder-solicitud-contacto.dto';

@Injectable()
export class ContactoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ContactoService');

  onModuleInit() {
    this.$connect();
  }

  async create(createContactoDto: CreateContactoDto) {
    // Validar que el usuario no se agregue a sí mismo como contacto
    if (createContactoDto.usuarioId === createContactoDto.contactoId) {
      throw new BadRequestException('Un usuario no puede agregarse a sí mismo como contacto');
    }

    // Verificar que ambos usuarios existen
    const usuario = await this.usuario.findUnique({
      where: { id: createContactoDto.usuarioId }
    });

    const contactoUsuario = await this.usuario.findUnique({
      where: { id: createContactoDto.contactoId }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createContactoDto.usuarioId} no encontrado`);
    }

    if (!contactoUsuario) {
      throw new NotFoundException(`Usuario contacto con ID ${createContactoDto.contactoId} no encontrado`);
    }

    // Verificar que no exista ya la relación (pendiente o aceptada)
    const existingContacto = await this.contacto.findFirst({
      where: {
        usuarioId: createContactoDto.usuarioId,
        contactoId: createContactoDto.contactoId,
        eliminado: false,
        estado: { in: ['P', 'A'] }
      }
    });

    if (existingContacto) {
      const estadoTexto = existingContacto.estado === 'P' ? 'pendiente' : 'aceptada';
      throw new BadRequestException(`Ya existe una solicitud de contacto ${estadoTexto} entre estos usuarios`);
    }

    // Crear solicitud en estado pendiente
    return this.contacto.create({
      data: {
        ...createContactoDto,
        estado: 'P' // Siempre se crea en estado pendiente
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        },
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      }
    });
  }

  async responderSolicitud(id: number, respuesta: ResponderSolicitudContactoDto, usuarioQueResponde: number) {
    const solicitud = await this.contacto.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        }
      }
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud de contacto con ID ${id} no encontrada`);
    }

    // Verificar que quien responde es el usuario contacto (quien recibió la solicitud)
    if (solicitud.contactoId !== usuarioQueResponde) {
      throw new BadRequestException('Solo el usuario solicitado puede responder a esta solicitud');
    }

    // Verificar que la solicitud esté pendiente
    if (solicitud.estado !== 'P') {
      throw new BadRequestException('Esta solicitud ya fue respondida anteriormente');
    }

    return this.contacto.update({
      where: { id },
      data: {
        estado: respuesta.estado,
        fchRespuesta: new Date()
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        },
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      }
    });
  }

  async findSolicitudesPendientes(usuarioId: number) {
    return this.contacto.findMany({
      where: {
        contactoId: usuarioId, // Solicitudes recibidas por este usuario
        estado: 'P',
        eliminado: false
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      },
      orderBy: {
        fchCreacion: 'desc'
      }
    });
  }

  async findSolicitudesEnviadas(usuarioId: number, soloPendientes:boolean = true) {
    return this.contacto.findMany({
      where: {
        usuarioId, // Solicitudes enviadas por este usuario
        eliminado: false,
        ...(soloPendientes ? { estado: 'P' } : {})
      },
      include: {
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      },
      orderBy: {
        fchCreacion: 'desc'
      }
    });
  }

  async findAll(includeDeleted: boolean = false) {
    return this.contacto.findMany({
      where: includeDeleted ? {} : { eliminado: false },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        },
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      },
      orderBy: {
        fchCreacion: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const contacto = await this.contacto.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        },
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      }
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return contacto;
  }

  async findByUsuario(usuarioId: number, includeDeleted: boolean = false) {
    return this.contacto.findMany({
      where: {
        usuarioId,
        ...(includeDeleted ? {} : { eliminado: false })
      },
      include: {
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      },
      orderBy: {
        fchCreacion: 'desc'
      }
    });
  }

  async findActiveContactsByUsuario(usuarioId: number, activoOnly: boolean = false) {
    return this.contacto.findMany({
      where: {
        usuarioId,
        estado: 'A', // Solo contactos aceptados
        ...(activoOnly ? { activo: true } : {}),
        eliminado: false
      },
      include: {
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      }
    });
  }

  async update(id: number, updateContactoDto: UpdateContactoDto) {
    const contacto = await this.findOne(id);

    // Si se está marcando como eliminado, establecer fecha de eliminación
    if (updateContactoDto.eliminado === true) {
      updateContactoDto = {
        ...updateContactoDto,
        fchEliminacion: new Date()
      } as any;
    } else if (updateContactoDto.eliminado === false) {
      // Si se está restaurando, quitar fecha de eliminación
      updateContactoDto = {
        ...updateContactoDto,
        fchEliminacion: null
      } as any;
    }

    return this.contacto.update({
      where: { id },
      data: updateContactoDto,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        },
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true,
            telefono: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const contacto = await this.findOne(id);

    // Soft delete
    return this.contacto.update({
      where: { id },
      data: {
        eliminado: true,
        fchEliminacion: new Date()
      }
    });
  }

  async restore(id: number) {
    const contacto = await this.contacto.findUnique({
      where: { id }
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return this.contacto.update({
      where: { id },
      data: {
        eliminado: false,
        fchEliminacion: null
      }
    });
  }

  async toggleActivo(id: number) {
    const contacto = await this.findOne(id);

    // Solo se puede activar/desactivar contactos aceptados
    if (contacto.estado !== 'A') {
      throw new BadRequestException('Solo se pueden activar/desactivar contactos aceptados');
    }

    return this.contacto.update({
      where: { id },
      data: {
        activo: !contacto.activo,
      }
    });
  }

  async buscarUsuariosParaContacto(usuarioId: number, termino: string) {
    // Validar que el término tenga al menos 3 caracteres
    if (termino.length < 3) {
      throw new BadRequestException('El término de búsqueda debe tener al menos 3 caracteres');
    }

    // Buscar usuarios que coincidan con el término (excepto el usuario actual)
    const usuarios = await this.usuario.findMany({
      where: {
        AND: [
          { id: { not: usuarioId } }, // Excluir al usuario actual
          { activo: true }, // Solo usuarios activos
          {
            OR: [
              { nombre: { contains: termino } },
              { apellido: { contains: termino } },
              { mail: { contains: termino } },
              // Buscar por ID si el término es numérico
              ...(isNaN(Number(termino)) ? [] : [{ id: Number(termino) }])
            ]
          }
        ]
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        mail: true,
        telefono: true
      },
      take: 20 // Limitar resultados
    });

    // Obtener los contactos existentes del usuario
    const contactosExistentes = await this.contacto.findMany({
      where: {
        usuarioId,
        eliminado: false
      },
      select: {
        contactoId: true,
        estado: true,
        activo: true
      }
    });

    // Crear un mapa para búsqueda rápida de contactos existentes
    const mapContactos = new Map();
    contactosExistentes.forEach(contacto => {
      mapContactos.set(contacto.contactoId, {
        estado: contacto.estado,
        activo: contacto.activo
      });
    });

    // Mapear los resultados con la información de contacto
    const resultados = usuarios.map(usuario => {
      const contactoInfo = mapContactos.get(usuario.id);
      
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        mail: usuario.mail,
        telefono: usuario.telefono,
        esContacto: !!contactoInfo,
        estadoContacto: contactoInfo?.estado,
        activoContacto: contactoInfo?.activo
      };
    });

    return resultados;
  }

  async cancelarSolicitud(id: number, usuarioQueCancela: number) {
    const solicitud = await this.contacto.findUnique({
      where: { id },
      include: {
        contactoUsuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            mail: true
          }
        }
      }
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud de contacto con ID ${id} no encontrada`);
    }

    // Verificar que quien cancela es el usuario que envió la solicitud
    if (solicitud.usuarioId !== usuarioQueCancela) {
      throw new BadRequestException('Solo el usuario que envió la solicitud puede cancelarla');
    }

    // Verificar que la solicitud esté pendiente
    if (solicitud.estado !== 'P') {
      throw new BadRequestException('Solo se pueden cancelar solicitudes pendientes');
    }

    // Eliminar la solicitud (hard delete ya que nunca fue aceptada)
    await this.contacto.delete({
      where: { id }
    });

    return {
      message: `Solicitud de contacto a ${solicitud.contactoUsuario.nombre} ${solicitud.contactoUsuario.apellido} cancelada exitosamente`,
      solicitudCancelada: {
        id: solicitud.id,
        contacto: {
          id: solicitud.contactoUsuario.id,
          nombre: solicitud.contactoUsuario.nombre,
          apellido: solicitud.contactoUsuario.apellido,
          mail: solicitud.contactoUsuario.mail
        }
      }
    };
  }
}
