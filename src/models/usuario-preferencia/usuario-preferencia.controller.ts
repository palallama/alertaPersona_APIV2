import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioPreferenciaService } from './usuario-preferencia.service';
import { CreateUsuarioPreferenciaDto } from './dto/create-usuario-preferencia.dto';
import { UpdateUsuarioPreferenciaDto } from './dto/update-usuario-preferencia.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuario Preferencia')
@ApiExcludeController()
@Controller('usuario-preferencias')
export class UsuarioPreferenciaController {
  constructor(
    private readonly usuarioPreferenciaService: UsuarioPreferenciaService,
  ) {}

  @Post()
  create(@Body() createUsuarioPreferenciaDto: CreateUsuarioPreferenciaDto) {
    return this.usuarioPreferenciaService.create(createUsuarioPreferenciaDto);
  }

  @Get()
  findAll() {
    return this.usuarioPreferenciaService.findAll();
  }

  @Get('usuario/:usuarioId/clave/:clave')
  findOne(
    @Param('usuarioId') usuarioId: string,
    @Param('clave') clave: string,
  ) {
    return this.usuarioPreferenciaService.findOne(+usuarioId, clave);
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.usuarioPreferenciaService.findByUsuario(+usuarioId);
  }

  @Get('clave/:clave')
  findByClave(@Param('clave') clave: string) {
    return this.usuarioPreferenciaService.findByClave(clave);
  }

  @Patch('usuario/:usuarioId/clave/:clave')
  update(
    @Param('usuarioId') usuarioId: string,
    @Param('clave') clave: string,
    @Body() updateUsuarioPreferenciaDto: UpdateUsuarioPreferenciaDto,
  ) {
    return this.usuarioPreferenciaService.update(
      +usuarioId,
      clave,
      updateUsuarioPreferenciaDto,
    );
  }

  @Delete('usuario/:usuarioId/clave/:clave')
  remove(
    @Param('usuarioId') usuarioId: string,
    @Param('clave') clave: string,
  ) {
    return this.usuarioPreferenciaService.remove(+usuarioId, clave);
  }

  @Get('/usuario/:usuarioId/clave/:clave/setDel')
  async setDelUsuarioPreferencia( @Param('usuarioId') usuarioId: string, @Param('clave') clave: string ) {
    return this.usuarioPreferenciaService.setDelUsuarioPreferencia(+usuarioId, clave);
  }
}