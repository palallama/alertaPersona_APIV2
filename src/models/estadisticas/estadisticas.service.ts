import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  FiltroFechasDto,
  FiltroAlertasDto,
  FiltroAlertasPorUsuarioDto,
} from './dto/create-estadistica.dto';

@Injectable()
export class EstadisticasService {
  constructor(private prisma: PrismaService) {}

  // ===== MÉTODOS DASHBOARD =====
  /**
   * Obtener todas las estadísticas del dashboard en una sola llamada
   */
  async getDashboard() {
    const [estadisticas, alertasPorDia, alertasPorHora] = await Promise.all([
      this.getDashboardEstadisticas(),
      this.getDashboardAlertasPorDia(7),
      this.getDashboardAlertasPorHora(),
    ]);

    return {
      estadisticas,
      alertasPorDia,
      alertasPorHora,
    };
  }

  /**
   * Obtener estadísticas generales para el dashboard
   */
  async getDashboardEstadisticas() {
    const [totalUsuarios, totalAlertas, alertasCanceladas] = await Promise.all([
      this.prisma.usuario.count(),
      this.prisma.alerta.count(),
      this.prisma.alerta.count({
        where: {
          estado: 'C', // C = Cancelada
        },
      }),
    ]);

    return {
      totalUsuarios,
      totalAlertas,
      alertasCanceladas,
    };
  }

  /**
   * Obtener alertas por día (últimos N días)
   */
  async getDashboardAlertasPorDia(dias: number = 7) {
    const hoy = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(hoy.getDate() - dias + 1);
    fechaInicio.setHours(0, 0, 0, 0);

    // Obtener todas las alertas del período
    const alertas = await this.prisma.alerta.findMany({
      where: {
        fchEmision: {
          gte: fechaInicio,
        },
      },
      select: {
        fchEmision: true,
        estado: true,
      },
    });

    // Agrupar por día
    const alertasPorDia = new Map<string, { alertasSolucionadas: number; alertasCanceladas: number }>();

    // Inicializar todos los días con 0
    for (let i = 0; i < dias; i++) {
      const fecha = new Date(fechaInicio);
      fecha.setDate(fechaInicio.getDate() + i);
      const fechaStr = fecha.toISOString().split('T')[0];
      alertasPorDia.set(fechaStr, { alertasSolucionadas: 0, alertasCanceladas: 0 });
    }

    // Contar alertas
    alertas.forEach((alerta) => {
      const fechaStr = alerta.fchEmision.toISOString().split('T')[0];
      const datos = alertasPorDia.get(fechaStr);
      if (datos) {
        if (alerta.estado === 'C') {
          // C = Cancelada
          datos.alertasCanceladas++;
        } else if (alerta.estado === 'S') {
          // S = Solucionada
          datos.alertasSolucionadas++;
        }
      }
    });

    // Convertir a array
    return Array.from(alertasPorDia.entries())
      .map(([fecha, datos]) => ({
        fecha,
        ...datos,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  /**
   * Obtener alertas por hora del día (0-23)
   */
  async getDashboardAlertasPorHora() {
    // Obtener todas las alertas
    const alertas = await this.prisma.alerta.findMany({
      select: {
        fchEmision: true,
      },
    });

    // Inicializar array de 24 horas con 0
    const alertasPorHora = Array.from({ length: 24 }, (_, hora) => ({
      hora,
      cantidad: 0,
    }));

    // Contar alertas por hora
    alertas.forEach((alerta) => {
      const hora = alerta.fchEmision.getHours();
      alertasPorHora[hora].cantidad++;
    });

    return alertasPorHora;
  }

  // ===== MÉTODOS ORIGINALES =====
  /**
   * Obtener cantidad de alertas por usuario específico con filtro de fechas opcional
   */
  async getAlertasPorUsuario(filtro: FiltroAlertasPorUsuarioDto) {
    const whereCondition: any = {
      usuarioId: filtro.usuarioId,
    };

    // Aplicar filtro de fechas si se proporciona
    if (filtro.desde || filtro.hasta) {
      whereCondition.fchEmision = {};
      if (filtro.desde) {
        whereCondition.fchEmision.gte = new Date(filtro.desde);
      }
      if (filtro.hasta) {
        whereCondition.fchEmision.lte = new Date(filtro.hasta);
      }
    }

    const total = await this.prisma.alerta.count({
      where: whereCondition,
    });

    // Obtener también estadísticas por estado
    const porEstado = await this.prisma.alerta.groupBy({
      by: ['estado'],
      where: whereCondition,
      _count: {
        id: true,
      },
    });

    const cerradas = await this.prisma.alerta.count({
      where: {
        ...whereCondition,
        cerrada: true,
      },
    });

    const abiertas = await this.prisma.alerta.count({
      where: {
        ...whereCondition,
        cerrada: false,
      },
    });

    return {
      usuarioId: filtro.usuarioId,
      total,
      abiertas,
      cerradas,
      porEstado: porEstado.map((item) => ({
        estado: item.estado,
        cantidad: item._count.id,
      })),
      filtros: {
        desde: filtro.desde || null,
        hasta: filtro.hasta || null,
      },
    };
  }

  /**
   * Obtener cantidad de alertas de todos los usuarios con filtro de fechas opcional
   */
  async getAlertasTotales(filtro: FiltroFechasDto) {
    const whereCondition: any = {};

    // Aplicar filtro de fechas si se proporciona
    if (filtro.desde || filtro.hasta) {
      whereCondition.fchEmision = {};
      if (filtro.desde) {
        whereCondition.fchEmision.gte = new Date(filtro.desde);
      }
      if (filtro.hasta) {
        whereCondition.fchEmision.lte = new Date(filtro.hasta);
      }
    }

    const total = await this.prisma.alerta.count({
      where: whereCondition,
    });

    // Estadísticas por estado
    const porEstado = await this.prisma.alerta.groupBy({
      by: ['estado'],
      where: whereCondition,
      _count: {
        id: true,
      },
    });

    const cerradas = await this.prisma.alerta.count({
      where: {
        ...whereCondition,
        cerrada: true,
      },
    });

    const abiertas = await this.prisma.alerta.count({
      where: {
        ...whereCondition,
        cerrada: false,
      },
    });

    // Alertas por usuario (top 10)
    const porUsuario = await this.prisma.alerta.groupBy({
      by: ['usuarioId'],
      where: whereCondition,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    return {
      total,
      abiertas,
      cerradas,
      porEstado: porEstado.map((item) => ({
        estado: item.estado,
        cantidad: item._count.id,
      })),
      top10Usuarios: porUsuario.map((item) => ({
        usuarioId: item.usuarioId,
        cantidad: item._count.id,
      })),
      filtros: {
        desde: filtro.desde || null,
        hasta: filtro.hasta || null,
      },
    };
  }

  /**
   * Obtener cantidad de alertas emitidas con filtro de fechas y estados
   */
  async getAlertasEmitidas(filtro: FiltroAlertasDto) {
    const whereCondition: any = {};

    // Aplicar filtro de fechas si se proporciona
    if (filtro.desde || filtro.hasta) {
      whereCondition.fchEmision = {};
      if (filtro.desde) {
        whereCondition.fchEmision.gte = new Date(filtro.desde);
      }
      if (filtro.hasta) {
        whereCondition.fchEmision.lte = new Date(filtro.hasta);
      }
    }

    // Aplicar filtro de estado si se proporciona
    if (filtro.estado) {
      whereCondition.estado = filtro.estado;
    }

    const total = await this.prisma.alerta.count({
      where: whereCondition,
    });

    // Si no se filtró por estado específico, obtener desglose
    let porEstado: { estado: string; cantidad: number }[] | null = null;
    if (!filtro.estado) {
      const estadoCount = await this.prisma.alerta.groupBy({
        by: ['estado'],
        where: whereCondition,
        _count: {
          id: true,
        },
      });
      porEstado = estadoCount.map((item) => ({
        estado: item.estado,
        cantidad: item._count.id,
      }));
    }

    const cerradas = await this.prisma.alerta.count({
      where: {
        ...whereCondition,
        cerrada: true,
      },
    });

    const abiertas = await this.prisma.alerta.count({
      where: {
        ...whereCondition,
        cerrada: false,
      },
    });

    // Promedio de alertas por día en el rango
    let promedioPorDia: string | null = null;
    if (filtro.desde && filtro.hasta) {
      const diasDiferencia = Math.ceil(
        (new Date(filtro.hasta).getTime() - new Date(filtro.desde).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (diasDiferencia > 0) {
        promedioPorDia = (total / diasDiferencia).toFixed(2);
      }
    }

    return {
      total,
      abiertas,
      cerradas,
      porEstado,
      promedioPorDia,
      filtros: {
        desde: filtro.desde || null,
        hasta: filtro.hasta || null,
        estado: filtro.estado || null,
      },
    };
  }

  /**
   * Obtener cantidad de usuarios registrados
   */
  async getUsuariosRegistrados() {
    const total = await this.prisma.usuario.count();

    const activos = await this.prisma.usuario.count({
      where: {
        activo: true,
      },
    });

    const inactivos = await this.prisma.usuario.count({
      where: {
        activo: false,
      },
    });

    const validados = await this.prisma.usuario.count({
      where: {
        validado: true,
      },
    });

    const noValidados = await this.prisma.usuario.count({
      where: {
        validado: false,
      },
    });

    // Usuarios por género
    const porGenero = await this.prisma.usuario.groupBy({
      by: ['genero'],
      _count: {
        id: true,
      },
    });

    // Usuarios registrados en los últimos 30 días
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const registradosUltimos30Dias = await this.prisma.usuario.count({
      where: {
        fechaCreacion: {
          gte: hace30Dias,
        },
      },
    });

    return {
      total,
      activos,
      inactivos,
      validados,
      noValidados,
      registradosUltimos30Dias,
      porGenero: porGenero.map((item) => ({
        genero: item.genero,
        cantidad: item._count.id,
      })),
    };
  }

  // Métodos legacy (mantener compatibilidad)
  create(createEstadisticaDto: any) {
    return 'Las estadísticas son de solo lectura';
  }

  findAll() {
    return `Use los endpoints específicos de estadísticas`;
  }

  findOne(id: number) {
    return `Use los endpoints específicos de estadísticas`;
  }

  update(id: number, updateEstadisticaDto: any) {
    return `Las estadísticas son de solo lectura`;
  }

  remove(id: number) {
    return `Las estadísticas son de solo lectura`;
  }
}
