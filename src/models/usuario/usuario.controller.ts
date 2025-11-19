import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios (opcionalmente filtrados por estado activo)' })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por usuarios activos' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll(@Query('activo') activo?: string) {
    let activoBool: boolean | undefined;
    if (activo !== undefined) {
      activoBool = activo === 'true';
    }
    return this.usuarioService.findAll(activoBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Get('email/:mail')
  @ApiOperation({ summary: 'Buscar usuario por correo electrónico' })
  @ApiParam({ name: 'mail', type: String })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByEmail(@Param('mail') mail: string) {
    return this.usuarioService.findByEmail(mail);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  @Get('historial-alertas/:id')
  @ApiOperation({ summary: 'Obtener historial de alertas del usuario (requiere autenticación)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Historial obtenido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async obtenerHistorialAlertas(@Param('id') id: string) {
    return this.usuarioService.obtenerHistorialAlertas(+id);
  }

  @Patch(':id/validar')
  @ApiOperation({ summary: 'Validar un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario validado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async validarUsuario(@Param('id') id: string) {
    return this.usuarioService.validarUsuario(+id);
  }

  @Patch(':id/invalidar')
  @ApiOperation({ summary: 'Invalidar un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario invalidado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async invalidarUsuario(@Param('id') id: string) {
    return this.usuarioService.invalidarUsuario(+id);
  }

  @Patch(':id/quitar-validacion')
  @ApiOperation({ summary: 'Quitar validación a un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Validación quitada exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async quitarValidacionUsuario(@Param('id') id: string) {
    return this.usuarioService.quitarValidacionUsuario(+id);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async activarUsuario(@Param('id') id: string) {
    return this.usuarioService.activarUsuario(+id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async desactivarUsuario(@Param('id') id: string) {
    return this.usuarioService.desactivarUsuario(+id);
  }

}
