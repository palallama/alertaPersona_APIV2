import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloseAlertaDto } from './dto/close-alerta.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioAdicionalService } from '../usuario-adicional/usuario-adicional.service';

@Injectable()
export class AlertaService extends PrismaClient implements OnModuleInit {
  private firebaseService: FirebaseService;
  private usuarioService: UsuarioService;
  private usuarioAdicionalService: UsuarioAdicionalService;

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
      ubicacion: {
        latitud: alerta.latitud,
        longitud: alerta.longitud,
      },
      // Eliminamos los campos originales para evitar duplicados
      latitud: undefined,
      longitud: undefined,
    };
  }

  private async emitirAlerta(alertaId: number, usuarioId: number) {
    // this.logger.log(`Emitiendo alerta con ID: ${alertaId} para el usuario ID: ${usuarioId}`);
    
    const data = {
      alerta: alertaId,
      motivo: 'A'
    }

    const usuarios = await this.usuarioService.findAll();

    usuarios.forEach(async usuario => {
      if (usuario.id !== usuarioId) {
        const token = await this.usuarioAdicionalService.findOne(usuario.id, 'notiToken');
        if (token) {
          this.firebaseService.sendNotificationAlerta(token.valor, data);
        }
      }
    });

  }
}