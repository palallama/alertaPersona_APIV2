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
import { NotificacionService } from './notificacion.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Notificaciones')
@Controller('notificaciones')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una notificación' })
  @ApiResponse({ status: 201, description: 'Notificación creada exitosamente' })
  create(@Body() createNotificacionDto: CreateNotificacionDto) {
    return this.notificacionService.create(createNotificacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones (opcionalmente filtradas por lectura)' })
  @ApiQuery({ name: 'leida', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  findAll(@Query('leida') leida?: string) {
    const leidaBool = leida ? leida === 'true' : undefined;
    return this.notificacionService.findAll(leidaBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Notificación encontrada' })
  findOne(@Param('id') id: string) {
    return this.notificacionService.findOne(+id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener notificaciones por ID de usuario (opcionalmente filtradas por lectura)' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiQuery({ name: 'leida', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones del usuario' })
  findByUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('leida') leida?: string,
  ) {
    const leidaBool = leida ? leida === 'true' : undefined;
    return this.notificacionService.findByUsuario(+usuarioId, leidaBool);
  }

  @Get('usuario/:usuarioId/contar-no-leidas')
  @ApiOperation({ summary: 'Contar notificaciones no leídas de un usuario' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({ status: 200, description: 'Cantidad de notificaciones no leídas' })
  contarNoLeidas(@Param('usuarioId') usuarioId: string) {
    return this.notificacionService.contarNoLeidas(+usuarioId);
  }

  @Patch(':id/marcar-leida')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  marcarComoLeida(@Param('id') id: string) {
    return this.notificacionService.marcarComoLeida(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una notificación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateNotificacionDto })
  @ApiResponse({ status: 200, description: 'Notificación actualizada' })
  update(
    @Param('id') id: string,
    @Body() updateNotificacionDto: UpdateNotificacionDto,
  ) {
    return this.notificacionService.update(+id, updateNotificacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Notificación eliminada' })
  remove(@Param('id') id: string) {
    return this.notificacionService.remove(+id);
  }
}
