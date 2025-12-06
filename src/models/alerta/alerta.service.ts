import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { CloseAlertaDto } from './dto/close-alerta.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioAdicionalService } from '../usuario-adicional/usuario-adicional.service';
import { ContactoService } from '../contacto/contacto.service';

@Injectable()
export class AlertaService extends PrismaClient implements OnModuleInit {
  constructor(
    private firebaseService: FirebaseService,
    private usuarioService: UsuarioService,
    private usuarioAdicionalService: UsuarioAdicionalService,
    private contactoService: ContactoService,
  ) {
    super();
  }

  private readonly logger = new Logger('AlertaService');
  onModuleInit() {
    this.$connect();
  }

  async create(createAlertaDto: CreateAlertaDto) {
    const alerta = await this.alerta.create({
      data: {
        ...createAlertaDto,
        fchCierre: null as unknown as Date,
        cerrada: false,
        estado: 'E'
      },
    });

    this.logger.log(`Alerta created with ID: ${alerta}`);

    if (alerta) {
      this.emitirAlerta(alerta.id, createAlertaDto.usuarioId);
    }

    return alerta;
  }

  async findAll(cerrada?: boolean) {
    const alertas = await this.alerta.findMany({
      where: cerrada !== undefined ? { cerrada } : {},
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

    return alertas.map(this.formatAlerta);
  }

  async findOne(id: number) {
    const alerta = await this.alerta.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
        asistentes: true,
      },
    });
    
    return this.formatAlerta(alerta);
  }

  async findByUsuario(usuarioId: number) {
    return this.alerta.findMany({
      where: { usuarioId },
      orderBy: { fchEmision: 'desc' },
    });
  }

  async update(id: number, updateAlertaDto: UpdateAlertaDto) {
    return this.alerta.update({
      where: { id },
      data: updateAlertaDto,
    });
  }

  async cerrarAlerta(closeAlertaDto: CloseAlertaDto) {
    await this.findOne(closeAlertaDto.id);

    return this.alerta.update({
      where: { id: closeAlertaDto.id },
      data: {
        cerrada: true,
        fchCierre: new Date(),
        estado: closeAlertaDto.estado,
      },
    });
  }

  async remove(id: number) {
    return this.alerta.delete({
      where: { id },
    });
  }



  
  private formatAlerta(alerta: any) {
    return {
      ...alerta,
      // ubicacion: {
      latitud: alerta.latitud,
      longitud: alerta.longitud,
      // },
      // Eliminamos los campos originales para evitar duplicados
      // latitud: undefined,
      // longitud: undefined,
    };
  }

  private async emitirAlerta(alertaId: number, usuarioId: number) {
    // this.logger.log(`Emitiendo alerta con ID: ${alertaId} para el usuario ID: ${usuarioId}`);
    
    const data = {
      alerta: String(alertaId),
      motivo: 'A'
    }

    const contactos = await this.contactoService.findActiveContactsByUsuario(usuarioId, true);
    this.logger.log(`Usuarios a notificar: ${JSON.stringify(contactos)}`);

    for (const contacto of contactos) {
      const token = await this.usuarioAdicionalService.findOne(contacto.contactoId, 'notiToken');
      if (token) {
        this.firebaseService.sendNotificationAlerta(token.valor, data);
        this.logger.log(`Notificación enviada al usuario ID: ${contacto.contactoId} con token: ${token.valor}`);
      }
    }
    // usuarios.forEach(async usuario => {
    //   if (usuario.id !== usuarioId && usuario.activo) {
    //     const token = await this.usuarioAdicionalService.findOne(usuario.id, 'notiToken');
    //     if (token) {
    //       this.firebaseService.sendNotificationAlerta(token.valor, data);
    //     }
    //   }
    // });

  }

  /**
   * Obtiene las alertas activas de los usuarios de los que soy un contacto activo
   * @param usuarioId ID del usuario que consulta (quien es contacto de otros)
   * @returns Lista de alertas activas con la información del contacto
   */
  async findActiveAlertsFromMyContacts(usuarioId: number) {
    // Buscar todos los contactos donde el usuario actual es el contacto (contactoId)
    // y la relación está aceptada y activa
    const contactRelations = await this.contacto.findMany({
      where: {
        contactoId: usuarioId, // Donde YO soy el contacto de alguien
        estado: 'A', // Relación aceptada
        activo: true, // Relación activa
        eliminado: false
      },
      select: {
        usuarioId: true, // El usuario que me tiene como contacto
      }
    });

    if (contactRelations.length === 0) {
      return {
        alerts: [],
        count: 0
      };
    }

    // Extraer los IDs de los usuarios que me tienen como contacto
    const usuarioIds = contactRelations.map(rel => rel.usuarioId);

    // Buscar alertas activas de esos usuarios
    const alertas = await this.alerta.findMany({
      where: {
        usuarioId: { in: usuarioIds },
        cerrada: false, // Solo alertas activas
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
          }
        }
      },
      orderBy: {
        fchEmision: 'desc'
      }
    });

    // Aplicar el mismo formato que otros endpoints
    const formattedAlerts = alertas.map(this.formatAlerta);
    
    return {
      alerts: formattedAlerts,
      count: formattedAlerts.length
    };
  }
}