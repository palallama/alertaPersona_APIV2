import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AsistenteService } from './asistente.service';
import { CreateAsistenteDto } from './dto/create-asistente.dto';
import { UpdateAsistenteDto } from './dto/update-asistente.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Asistente')
@Controller('asistente')
export class AsistenteController {
  constructor(private readonly asistenteService: AsistenteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo asistente para una alerta' })
  @ApiResponse({ status: 201, description: 'Asistente creado' })
  create(@Body() createAsistenteDto: CreateAsistenteDto) {
    return this.asistenteService.create(createAsistenteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los asistentes' })
  @ApiResponse({ status: 200, description: 'Lista de asistentes' })
  findAll() {
    return this.asistenteService.findAll();
  }

  @Get('alerta/:alertaId/usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener un asistente por alerta y usuario' })
  @ApiParam({ name: 'alertaId', type: Number })
  @ApiParam({ name: 'usuarioId', type: Number })
  findOne(
    @Param('alertaId') alertaId: string,
    @Param('usuarioId') usuarioId: string,
  ) {
    return this.asistenteService.findOne(+alertaId, +usuarioId);
  }

  @Get('alerta/:alertaId')
  @ApiOperation({ summary: 'Obtener asistentes por ID de alerta' })
  @ApiParam({ name: 'alertaId', type: Number })
  findByAlerta(@Param('alertaId') alertaId: string) {
    return this.asistenteService.findByAlerta(+alertaId);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener asistentes por ID de usuario' })
  @ApiParam({ name: 'usuarioId', type: Number })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.asistenteService.findByUsuario(+usuarioId);
  }

  @Patch('alerta/:alertaId/usuario/:usuarioId')
  @ApiOperation({ summary: 'Actualizar un asistente por alerta y usuario' })
  @ApiParam({ name: 'alertaId', type: Number })
  @ApiParam({ name: 'usuarioId', type: Number })
  update(
    @Param('alertaId') alertaId: string,
    @Param('usuarioId') usuarioId: string,
    @Body() updateAsistenteDto: UpdateAsistenteDto,
  ) {
    return this.asistenteService.update(
      +alertaId,
      +usuarioId,
      updateAsistenteDto,
    );
  }

  @Delete('alerta/:alertaId/usuario/:usuarioId')
  @ApiOperation({ summary: 'Eliminar un asistente por alerta y usuario' })
  @ApiParam({ name: 'alertaId', type: Number })
  @ApiParam({ name: 'usuarioId', type: Number })
  remove(
    @Param('alertaId') alertaId: string,
    @Param('usuarioId') usuarioId: string,
  ) {
    return this.asistenteService.remove(+alertaId, +usuarioId);
  }
}
