import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EstadisticasService } from './estadisticas.service';
import {
  FiltroFechasDto,
  FiltroAlertasDto,
  FiltroAlertasPorUsuarioDto,
} from './dto/create-estadistica.dto';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto';

@ApiTags('Estadísticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('alertas/usuario/:usuarioId')
  @ApiOperation({
    summary: 'Obtener cantidad de alertas por usuario específico',
    description:
      'Devuelve estadísticas de alertas de un usuario con filtros opcionales de fecha',
  })
  @ApiParam({
    name: 'usuarioId',
    type: Number,
    description: 'ID del usuario',
    example: 1,
  })
  @ApiQuery({
    name: 'desde',
    required: false,
    type: String,
    description: 'Fecha inicio (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'hasta',
    required: false,
    type: String,
    description: 'Fecha fin (ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de alertas del usuario',
    schema: {
      example: {
        usuarioId: 1,
        total: 15,
        abiertas: 3,
        cerradas: 12,
        porEstado: [
          { estado: 'E', cantidad: 2 },
          { estado: 'C', cantidad: 1 },
          { estado: 'S', cantidad: 10 },
          { estado: 'X', cantidad: 2 },
        ],
        filtros: {
          desde: '2025-01-01T00:00:00.000Z',
          hasta: '2025-12-31T23:59:59.999Z',
        },
      },
    },
  })
  getAlertasPorUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const filtro: FiltroAlertasPorUsuarioDto = {
      usuarioId: +usuarioId,
      desde,
      hasta,
    };
    return this.estadisticasService.getAlertasPorUsuario(filtro);
  }

  @Get('alertas/totales')
  @ApiOperation({
    summary: 'Obtener cantidad total de alertas de todos los usuarios',
    description:
      'Devuelve estadísticas generales de todas las alertas con filtros opcionales de fecha',
  })
  @ApiQuery({
    name: 'desde',
    required: false,
    type: String,
    description: 'Fecha inicio (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'hasta',
    required: false,
    type: String,
    description: 'Fecha fin (ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas totales de alertas',
    schema: {
      example: {
        total: 150,
        abiertas: 25,
        cerradas: 125,
        porEstado: [
          { estado: 'E', cantidad: 20 },
          { estado: 'C', cantidad: 5 },
          { estado: 'S', cantidad: 100 },
          { estado: 'X', cantidad: 25 },
        ],
        top10Usuarios: [
          { usuarioId: 1, cantidad: 15 },
          { usuarioId: 2, cantidad: 12 },
        ],
        filtros: {
          desde: null,
          hasta: null,
        },
      },
    },
  })
  getAlertasTotales(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const filtro: FiltroFechasDto = { desde, hasta };
    return this.estadisticasService.getAlertasTotales(filtro);
  }

  @Get('alertas/emitidas')
  @ApiOperation({
    summary: 'Obtener cantidad de alertas emitidas',
    description:
      'Devuelve estadísticas de alertas emitidas con filtros opcionales de fecha y estado',
  })
  @ApiQuery({
    name: 'desde',
    required: false,
    type: String,
    description: 'Fecha inicio (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'hasta',
    required: false,
    type: String,
    description: 'Fecha fin (ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    type: String,
    description: 'Estado de alerta (E=Emitida, C=Cancelada, S=Solucionada, X=Expirada)',
    enum: ['E', 'C', 'S', 'X'],
    example: 'E',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de alertas emitidas',
    schema: {
      example: {
        total: 150,
        abiertas: 25,
        cerradas: 125,
        porEstado: [
          { estado: 'E', cantidad: 20 },
          { estado: 'C', cantidad: 5 },
          { estado: 'S', cantidad: 100 },
          { estado: 'X', cantidad: 25 },
        ],
        promedioPorDia: '4.11',
        filtros: {
          desde: '2025-01-01T00:00:00.000Z',
          hasta: '2025-12-31T23:59:59.999Z',
          estado: null,
        },
      },
    },
  })
  getAlertasEmitidas(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('estado') estado?: string,
  ) {
    const filtro: FiltroAlertasDto = { desde, hasta, estado };
    return this.estadisticasService.getAlertasEmitidas(filtro);
  }

  @Get('usuarios/registrados')
  @ApiOperation({
    summary: 'Obtener cantidad de usuarios registrados',
    description:
      'Devuelve estadísticas completas de usuarios registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de usuarios registrados',
    schema: {
      example: {
        total: 250,
        activos: 230,
        inactivos: 20,
        validados: 200,
        noValidados: 50,
        registradosUltimos30Dias: 15,
        porGenero: [
          { genero: 'M', cantidad: 120 },
          { genero: 'F', cantidad: 110 },
          { genero: 'O', cantidad: 20 },
        ],
      },
    },
  })
  getUsuariosRegistrados() {
    return this.estadisticasService.getUsuariosRegistrados();
  }

  // Endpoints legacy (mantener compatibilidad con scaffold generado)
  @Post()
  @ApiOperation({ summary: '[Legacy] No disponible - Solo lectura' })
  @ApiResponse({
    status: 200,
    description: 'Las estadísticas son de solo lectura',
  })
  create(@Body() createEstadisticaDto: any) {
    return this.estadisticasService.create(createEstadisticaDto);
  }

  @Get()
  @ApiOperation({ summary: '[Legacy] Obtener información sobre endpoints' })
  @ApiResponse({
    status: 200,
    description: 'Información de endpoints disponibles',
  })
  findAll() {
    return this.estadisticasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Legacy] No disponible - Solo lectura' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Use los endpoints específicos de estadísticas',
  })
  findOne(@Param('id') id: string) {
    return this.estadisticasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Legacy] No disponible - Solo lectura' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Las estadísticas son de solo lectura',
  })
  update(@Param('id') id: string, @Body() updateEstadisticaDto: UpdateEstadisticaDto) {
    return this.estadisticasService.update(+id, updateEstadisticaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Legacy] No disponible - Solo lectura' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Las estadísticas son de solo lectura',
  })
  remove(@Param('id') id: string) {
    return this.estadisticasService.remove(+id);
  }
}
