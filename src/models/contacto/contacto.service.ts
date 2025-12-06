import { Injectable, Logger, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { ResponderSolicitudContactoDto } from './dto/responder-solicitud-contacto.dto';
import { CrearInvitacionDto } from './dto/crear-invitacion.dto';
import { MailService } from '../mail/mail.service';
import { FirebaseService } from '../firebase/firebase.service';
import { UsuarioAdicionalService } from '../usuario-adicional/usuario-adicional.service';
import { nanoid } from 'nanoid';

@Injectable()
export class ContactoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ContactoService');
  private readonly frontendUrl: string;

  constructor(
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    private readonly usuarioAdicionalService: UsuarioAdicionalService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.frontendUrl = this.configService.get<string>('environment.frontend_url') || 'https://alertapersona.com';
  }

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
    const solicitud = await this.contacto.create({
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

    // Enviar notificación push al usuario que recibió la solicitud
    this.enviarNotificacionSolicitud(solicitud.id, solicitud.contactoId, solicitud.usuario);

    return solicitud;
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

    // Si se acepta la solicitud, crear relación bidireccional
    if (respuesta.estado === 'A') {
      // Actualizar la solicitud original a aceptada
      const solicitudActualizada = await this.contacto.update({
        where: { id },
        data: {
          estado: 'A',
          activo: true,
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

      // Crear la relación inversa (usuario que aceptó -> usuario que solicitó)
      await this.crearRelacionContactoBidireccional(
        solicitud.contactoId,
        solicitud.usuarioId
      );

      return solicitudActualizada;
    }

    // Si se rechaza, solo actualizar el estado
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

  // ==================== INVITACIONES ====================

  /**
   * Envía una invitación por email a un usuario que no está registrado
   */
  async enviarInvitacion(crearInvitacionDto: CrearInvitacionDto) {
    // Verificar que el usuario que envía la invitación existe
    const usuario = await this.usuario.findUnique({
      where: { id: crearInvitacionDto.usuarioId }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${crearInvitacionDto.usuarioId} no encontrado`);
    }

    // Verificar que no exista un usuario registrado con ese email
    const usuarioExistente = await this.usuario.findUnique({
      where: { mail: crearInvitacionDto.email }
    });

    if (usuarioExistente) {
      throw new BadRequestException('Ya existe un usuario registrado con este email. Busca al usuario para enviarte una solicitud de contacto.');
    }

    // Verificar que no haya una invitación pendiente a este email
    const invitacionPendiente = await this.invitacion.findFirst({
      where: {
        usuarioId: crearInvitacionDto.usuarioId,
        email: crearInvitacionDto.email,
        estado: 'P',
        fchExpiracion: {
          gte: new Date() // Que no haya expirado
        }
      }
    });

    if (invitacionPendiente) {
      throw new BadRequestException('Ya existe una invitación pendiente para este email');
    }

    // Generar código único para la invitación
    const codigo = `user_${nanoid(10)}`;

    // Fecha de expiración (7 días desde ahora)
    const fchExpiracion = new Date();
    fchExpiracion.setDate(fchExpiracion.getDate() + 7);

    // Crear la invitación
    const invitacion = await this.invitacion.create({
      data: {
        usuarioId: crearInvitacionDto.usuarioId,
        email: crearInvitacionDto.email,
        telefono: crearInvitacionDto.telefono,
        codigo,
        mensaje: crearInvitacionDto.mensaje,
        fchExpiracion,
        estado: 'P'
      },
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

    // Generar link de invitación
    const link = `${this.frontendUrl}/invitacion/${codigo}`;

    // Enviar email de invitación
    await this.mailService.enviarInvitacionContacto(
      crearInvitacionDto.email,
      {
        nombreRemitente: `${usuario.nombre} ${usuario.apellido}`,
        mensaje: crearInvitacionDto.mensaje,
        link,
        codigo
      }
    );

    return {
      ...invitacion,
      link
    };
  }

  /**
   * Obtiene las invitaciones enviadas por un usuario
   */
  async obtenerInvitacionesEnviadas(usuarioId: number, includeExpired: boolean = false) {
    const where: any = {
      usuarioId
    };

    if (!includeExpired) {
      where.AND = [
        { estado: { in: ['P', 'A'] } },
        {
          OR: [
            { estado: 'A' }, // Las aceptadas siempre se muestran
            {
              estado: 'P',
              fchExpiracion: { gte: new Date() } // Las pendientes solo si no expiraron
            }
          ]
        }
      ];
    }

    const invitaciones = await this.invitacion.findMany({
      where,
      orderBy: {
        fchCreacion: 'desc'
      }
    });

    // Agregar el link a cada invitación
    return invitaciones.map(inv => ({
      ...inv,
      link: `${this.frontendUrl}/invitacion/${inv.codigo}`
    }));
  }

  /**
   * Valida un código de invitación y retorna la información
   */
  async validarCodigoInvitacion(codigo: string) {
    const invitacion = await this.invitacion.findUnique({
      where: { codigo },
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

    if (!invitacion) {
      throw new NotFoundException('Código de invitación no válido');
    }

    // Verificar si expiró
    if (invitacion.fchExpiracion < new Date()) {
      // Marcar como expirada si está pendiente
      if (invitacion.estado === 'P') {
        await this.invitacion.update({
          where: { id: invitacion.id },
          data: { estado: 'E' }
        });
      }
      throw new BadRequestException('Esta invitación ha expirado');
    }

    // Verificar el estado
    if (invitacion.estado !== 'P') {
      const estadoTexto = {
        'A': 'ya fue aceptada',
        'R': 'fue rechazada',
        'E': 'ha expirado'
      };
      throw new BadRequestException(`Esta invitación ${estadoTexto[invitacion.estado] || 'no está disponible'}`);
    }

    return {
      ...invitacion,
      link: `${this.frontendUrl}/invitacion/${invitacion.codigo}`
    };
  }

  /**
   * Acepta una invitación y crea la relación de contacto
   * Se llama cuando un usuario se registra o inicia sesión con el código de invitación
   */
  async aceptarInvitacion(codigo: string, usuarioRegistradoId: number) {
    const invitacion = await this.validarCodigoInvitacion(codigo);

    // Verificar que el usuario que acepta existe
    const usuarioRegistrado = await this.usuario.findUnique({
      where: { id: usuarioRegistradoId }
    });

    if (!usuarioRegistrado) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el email coincida SOLO si la invitación tiene email específico
    // (las invitaciones genéricas tienen email vacío)
    if (invitacion.email && invitacion.email !== '' && usuarioRegistrado.mail !== invitacion.email) {
      throw new BadRequestException('El email del usuario no coincide con la invitación');
    }

    // Verificar que no se esté agregando a sí mismo
    if (usuarioRegistradoId === invitacion.usuarioId) {
      throw new BadRequestException('No puedes aceptar tu propia invitación');
    }

    // Verificar que no exista ya una relación de contacto entre estos usuarios
    const contactoExistente = await this.contacto.findFirst({
      where: {
        OR: [
          {
            usuarioId: invitacion.usuarioId,
            contactoId: usuarioRegistradoId,
            eliminado: false
          },
          {
            usuarioId: usuarioRegistradoId,
            contactoId: invitacion.usuarioId,
            eliminado: false
          }
        ]
      }
    });

    if (contactoExistente) {
      throw new BadRequestException('Ya existe una relación de contacto entre estos usuarios');
    }

    // Marcar la invitación como aceptada
    await this.invitacion.update({
      where: { id: invitacion.id },
      data: {
        estado: 'A',
        fchRespuesta: new Date(),
        usuarioRegistradoId,
        // Si es invitación genérica, actualizar con el email del usuario que aceptó
        ...(invitacion.email === '' ? { email: usuarioRegistrado.mail } : {})
      }
    });

    // Crear las relaciones de contacto bidireccionales
    const contacto1 = await this.crearRelacionContactoBidireccional(
      invitacion.usuarioId,
      usuarioRegistradoId
    );

    const contacto2 = await this.crearRelacionContactoBidireccional(
      usuarioRegistradoId,
      invitacion.usuarioId
    );

    return {
      message: 'Invitación aceptada exitosamente',
      invitacion,
      contactos: [contacto1, contacto2]
    };
  }

  /**
   * Cancela/elimina una invitación
   */
  async cancelarInvitacion(invitacionId: number, usuarioId: number) {
    const invitacion = await this.invitacion.findUnique({
      where: { id: invitacionId }
    });

    if (!invitacion) {
      throw new NotFoundException('Invitación no encontrada');
    }

    // Verificar que quien cancela es quien la envió
    if (invitacion.usuarioId !== usuarioId) {
      throw new BadRequestException('Solo puedes cancelar invitaciones que enviaste');
    }

    // Solo se pueden cancelar invitaciones pendientes
    if (invitacion.estado !== 'P') {
      throw new BadRequestException('Solo puedes cancelar invitaciones pendientes');
    }

    // Eliminar la invitación
    await this.invitacion.delete({
      where: { id: invitacionId }
    });

    return {
      message: 'Invitación cancelada exitosamente'
    };
  }

  /**
   * Genera un link de invitación para compartir (sin enviar email)
   */
  async generarLinkInvitacion(usuarioId: number) {
    // Verificar que el usuario existe
    const usuario = await this.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Generar código único
    const codigo = `user_${nanoid(10)}`;

    // Fecha de expiración (30 días para links generales)
    const fchExpiracion = new Date();
    fchExpiracion.setDate(fchExpiracion.getDate() + 30);

    // Crear invitación genérica (sin email específico)
    const invitacion = await this.invitacion.create({
      data: {
        usuarioId,
        email: '', // Email vacío para invitaciones genéricas
        codigo,
        fchExpiracion,
        estado: 'P',
        mensaje: 'Invitación para agregar contacto'
      }
    });

    const link = `${this.frontendUrl}/invitacion/${codigo}`;

    return {
      ...invitacion,
      link,
      qrData: link // Este link se puede usar para generar QR en el frontend
    };
  }

  /**
   * Crea una relación de contacto unidireccional
   * Utilizado para crear relaciones bidireccionales
   */
  private async crearRelacionContactoBidireccional(usuarioId: number, contactoId: number) {
    // Verificar si ya existe una relación (podría estar eliminada o rechazada)
    const relacionExistente = await this.contacto.findFirst({
      where: {
        usuarioId,
        contactoId,
        eliminado: false
      }
    });

    // Si existe y está aceptada, no hacer nada
    if (relacionExistente && relacionExistente.estado === 'A') {
      return relacionExistente;
    }

    // Si existe pero fue rechazada o está en otro estado, actualizarla
    if (relacionExistente) {
      return this.contacto.update({
        where: { id: relacionExistente.id },
        data: {
          estado: 'A',
          activo: true,
          fchRespuesta: new Date(),
          eliminado: false,
          fchEliminacion: null
        }
      });
    }

    // Si no existe, crear nueva relación
    return this.contacto.create({
      data: {
        usuarioId,
        contactoId,
        estado: 'A',
        activo: true
      }
    });
  }

  /**
   * Envía notificación push al usuario que recibió la solicitud de contacto
   */
  private async enviarNotificacionSolicitud(
    solicitudId: number, 
    contactoId: number, 
    usuarioSolicitante: { nombre: string; apellido: string }
  ) {
    try {
      const data = {
        solicitud: String(solicitudId),
        motivo: 'S' // S = Solicitud de contacto
      };

      // Obtener el token del usuario que recibió la solicitud
      const token = await this.usuarioAdicionalService.findOne(contactoId, 'notiToken');
      
      if (token) {
        await this.firebaseService.sendNotificationSolicitudContacto(token.valor, data);
        this.logger.log(`Notificación de solicitud enviada al usuario ID: ${contactoId} de ${usuarioSolicitante.nombre} ${usuarioSolicitante.apellido}`);
      } else {
        this.logger.warn(`Usuario ID: ${contactoId} no tiene token de notificación registrado`);
      }
    } catch (error) {
      this.logger.error(`Error al enviar notificación de solicitud: ${error.message}`);
      // No lanzamos el error para que no afecte la creación de la solicitud
    }
  }
}
