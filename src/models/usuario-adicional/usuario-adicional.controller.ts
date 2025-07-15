import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuarioAdicionalService } from './usuario-adicional.service';
import { CreateUsuarioAdicionalDto } from './dto/create-usuario-adicional.dto';
import { UpdateUsuarioAdicionalDto } from './dto/update-usuario-adicional.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Usuario Adicional')
@Controller('usuario-adicional')
export class UsuarioAdicionalController {
  constructor(private readonly usuarioAdicionalService: UsuarioAdicionalService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un usuario adicional' })
  @ApiResponse({ status: 201, description: 'Usuario adicional creado' })
  create(@Body() createUsuarioAdicionalDto: CreateUsuarioAdicionalDto) {
    return this.usuarioAdicionalService.create(createUsuarioAdicionalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios adicionales' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios adicionales' })
  findAll() {
    return this.usuarioAdicionalService.findAll();
  }

  @Get('usuario/:usuarioId/clave/:clave')
  @ApiOperation({ summary: 'Obtener un usuario adicional por usuarioId y clave' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiParam({ name: 'clave', type: String })
  @ApiResponse({ status: 200, description: 'Usuario adicional encontrado' })
  findOne(
    @Param('usuarioId') usuarioId: string,
    @Param('clave') clave: string,
  ) {
    return this.usuarioAdicionalService.findOne(+usuarioId, clave);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener todos los usuarios adicionales por usuarioId' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de usuarios adicionales' })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.usuarioAdicionalService.findByUsuario(+usuarioId);
  }

  @Get('clave/:clave')
  @ApiOperation({ summary: 'Obtener usuario adicional por clave' })
  @ApiParam({ name: 'clave', type: String })
  @ApiResponse({ status: 200, description: 'Usuario adicional encontrado' })
  findByClave(@Param('clave') clave: string) {
    return this.usuarioAdicionalService.findByClave(clave);
  }

  @Patch('usuario/:usuarioId/clave/:clave')
  @ApiOperation({ summary: 'Actualizar usuario adicional por usuarioId y clave' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiParam({ name: 'clave', type: String })
  @ApiBody({ type: UpdateUsuarioAdicionalDto })
  @ApiResponse({ status: 200, description: 'Usuario adicional actualizado' })
  update(
    @Param('usuarioId') usuarioId: string,
    @Param('clave') clave: string,
    @Body() updateUsuarioAdicionalDto: UpdateUsuarioAdicionalDto,
  ) {
    return this.usuarioAdicionalService.update(
      +usuarioId,
      clave,
      updateUsuarioAdicionalDto,
    );
  }

  @Delete('usuario/:usuarioId/clave/:clave')
  @ApiOperation({ summary: 'Eliminar usuario adicional por usuarioId y clave' })
  @ApiParam({ name: 'usuarioId', type: Number })
  @ApiParam({ name: 'clave', type: String })
  @ApiResponse({ status: 200, description: 'Usuario adicional eliminado' })
  remove(
    @Param('usuarioId') usuarioId: string,
    @Param('clave') clave: string,
  ) {
    return this.usuarioAdicionalService.remove(+usuarioId, clave);
  }
}
