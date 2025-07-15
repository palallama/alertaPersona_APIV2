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
import { AlertaService } from './alerta.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { CloseAlertaDto } from './dto/close-alerta.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Alerta')
@Controller('alerta')
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva alerta' })
  @ApiResponse({ status: 201, description: 'Alerta creada correctamente' })
  create(@Body() createAlertaDto: CreateAlertaDto) {
    return this.alertaService.create(createAlertaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las alertas, con opción de filtrar por estado cerrada' })
  @ApiQuery({ name: 'cerrada', required: false, type: Boolean, description: 'Filtrar por alertas cerradas' })
  @ApiResponse({ status: 200, description: 'Lista de alertas' })
  findAll(@Query('cerrada') cerrada?: string) {
    const cerradaBool = cerrada ? cerrada === 'true' : undefined;
    return this.alertaService.findAll(cerradaBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una alerta por su ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Alerta encontrada' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.alertaService.findOne(+id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener alertas por ID de usuario' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({ status: 200, description: 'Alertas del usuario' })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.alertaService.findByUsuario(+usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una alerta' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Alerta actualizada' })
  update(@Param('id') id: string, @Body() updateAlertaDto: UpdateAlertaDto) {
    return this.alertaService.update(+id, updateAlertaDto);
  }

  @Patch(':id/cerrar')
  @ApiOperation({ summary: 'Cerrar una alerta existente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Alerta cerrada' })
  cerrarAlerta(@Param('id') id: string, @Body() closeAlertaDto: CloseAlertaDto) {
    return this.alertaService.cerrarAlerta(closeAlertaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una alerta por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Alerta eliminada' })
  remove(@Param('id') id: string) {
    return this.alertaService.remove(+id);
  }
}
