import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { ResponderSolicitudContactoDto } from './dto/responder-solicitud-contacto.dto';
import { UsuarioBusquedaDto } from './dto/usuario-busqueda.dto';
import { CancelarSolicitudResponseDto } from './dto/cancelar-solicitud-response.dto';
import { CrearInvitacionDto } from './dto/crear-invitacion.dto';
import { ValidarInvitacionDto } from './dto/validar-invitacion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Contacto } from './entities/contacto.entity';
import { Invitacion } from './entities/invitacion.entity';

@ApiTags('contactos')
@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar solicitud de contacto' })
  @ApiResponse({ 
    status: 201, 
    description: 'Solicitud de contacto enviada exitosamente (estado pendiente)',
    type: Contacto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o solicitud ya existe' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  create(@Body() createContactoDto: CreateContactoDto) {
    return this.contactoService.create(createContactoDto);
  }

  @Patch(':id/responder')
  @ApiOperation({ summary: 'Responder a una solicitud de contacto (aceptar/rechazar)' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de contacto' })
  @ApiBody({ type: ResponderSolicitudContactoDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Solicitud respondida exitosamente',
    type: Contacto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Solo el usuario solicitado puede responder o solicitud ya respondida' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Solicitud no encontrada' 
  })
  responderSolicitud(
    @Param('id', ParseIntPipe) id: number, 
    @Body() respuesta: ResponderSolicitudContactoDto,
    @Query('usuarioId', ParseIntPipe) usuarioQueResponde: number
  ) {
    return this.contactoService.responderSolicitud(id, respuesta, usuarioQueResponde);
  }

  @Get('solicitudes-pendientes/:usuarioId')
  @ApiOperation({ summary: 'Obtener solicitudes de contacto pendientes recibidas por un usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario que recibió las solicitudes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de solicitudes pendientes recibidas',
    type: [Contacto] 
  })
  findSolicitudesPendientes(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.contactoService.findSolicitudesPendientes(usuarioId);
  }

  @Get('solicitudes-enviadas/:usuarioId')
  @ApiOperation({ summary: 'Obtener solicitudes de contacto enviadas por un usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario que envió las solicitudes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de solicitudes enviadas por el usuario',
    type: [Contacto] 
  })
  findSolicitudesEnviadas(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.contactoService.findSolicitudesEnviadas(usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los contactos' })
  @ApiQuery({ 
    name: 'includeDeleted', 
    required: false, 
    type: Boolean,
    description: 'Incluir contactos eliminados' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de contactos',
    type: [Contacto] 
  })
  findAll(@Query('includeDeleted') includeDeleted?: string) {
    const includeDeletedBool = includeDeleted === 'true';
    return this.contactoService.findAll(includeDeletedBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contacto por ID' })
  @ApiParam({ name: 'id', description: 'ID del contacto' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contacto encontrado',
    type: Contacto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contacto no encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener contactos de un usuario específico' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiQuery({ 
    name: 'includeDeleted', 
    required: false, 
    type: Boolean,
    description: 'Incluir contactos eliminados' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de contactos del usuario',
    type: [Contacto] 
  })
  findByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('includeDeleted') includeDeleted?: string
  ) {
    const includeDeletedBool = includeDeleted === 'true';
    return this.contactoService.findByUsuario(usuarioId, includeDeletedBool);
  }

  @Get('usuario/:usuarioId/activos')
  @ApiOperation({ summary: 'Obtener contactos aceptados y activos de un usuario (para notificaciones de alertas)' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de contactos activos del usuario',
    type: [Contacto] 
  })
  findActiveContactsByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.contactoService.findActiveContactsByUsuario(usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un contacto' })
  @ApiParam({ name: 'id', description: 'ID del contacto' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contacto actualizado exitosamente',
    type: Contacto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contacto no encontrado' 
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateContactoDto: UpdateContactoDto) {
    return this.contactoService.update(id, updateContactoDto);
  }

  @Patch(':id/toggle-activo')
  @ApiOperation({ summary: 'Activar/desactivar notificaciones para un contacto aceptado' })
  @ApiParam({ name: 'id', description: 'ID del contacto' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de contacto cambiado exitosamente',
    type: Contacto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Solo se pueden activar/desactivar contactos aceptados' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contacto no encontrado' 
  })
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.toggleActivo(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar un contacto eliminado' })
  @ApiParam({ name: 'id', description: 'ID del contacto' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contacto restaurado exitosamente',
    type: Contacto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contacto no encontrado' 
  })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.restore(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un contacto (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del contacto' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contacto eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Contacto no encontrado' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactoService.remove(id);
  }

  @Get('buscar-usuarios/:usuarioId')
  @ApiOperation({ summary: 'Buscar usuarios para agregar como contactos' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario que busca contactos' })
  @ApiQuery({ 
    name: 'q', 
    description: 'Término de búsqueda (mínimo 3 caracteres). Busca por nombre, apellido, email o ID',
    example: 'juan'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios encontrados con información de contacto',
    type: [UsuarioBusquedaDto] 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El término de búsqueda debe tener al menos 3 caracteres' 
  })
  buscarUsuarios(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('q') termino: string
  ) {
    return this.contactoService.buscarUsuariosParaContacto(usuarioId, termino);
  }

  @Delete('cancelar-solicitud/:id')
  @ApiOperation({ summary: 'Cancelar una solicitud de contacto enviada (elimina el registro)' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de contacto a cancelar' })
  @ApiQuery({ 
    name: 'usuarioId', 
    description: 'ID del usuario que envió la solicitud',
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Solicitud cancelada exitosamente',
    type: CancelarSolicitudResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Solo el usuario que envió la solicitud puede cancelarla o la solicitud no está pendiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Solicitud de contacto no encontrada' 
  })
  cancelarSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuarioId', ParseIntPipe) usuarioQueCancela: number
  ) {
    return this.contactoService.cancelarSolicitud(id, usuarioQueCancela);
  }

  // ==================== ENDPOINTS DE INVITACIONES ====================

  @Post('invitacion')
  @ApiOperation({ summary: 'Enviar invitación por email a un usuario no registrado' })
  @ApiBody({ type: CrearInvitacionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Invitación enviada exitosamente',
    type: Invitacion 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El usuario ya está registrado o ya existe una invitación pendiente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario que envía la invitación no encontrado' 
  })
  enviarInvitacion(@Body() crearInvitacionDto: CrearInvitacionDto) {
    return this.contactoService.enviarInvitacion(crearInvitacionDto);
  }

  @Get('invitaciones/:usuarioId')
  @ApiOperation({ summary: 'Obtener invitaciones enviadas por un usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario que envió las invitaciones' })
  @ApiQuery({ 
    name: 'includeExpired', 
    required: false, 
    type: Boolean,
    description: 'Incluir invitaciones expiradas' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de invitaciones enviadas',
    type: [Invitacion] 
  })
  obtenerInvitacionesEnviadas(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('includeExpired') includeExpired?: string
  ) {
    const includeExpiredBool = includeExpired === 'true';
    return this.contactoService.obtenerInvitacionesEnviadas(usuarioId, includeExpiredBool);
  }

  @Post('invitacion/validar')
  @ApiOperation({ summary: 'Validar un código de invitación' })
  @ApiBody({ type: ValidarInvitacionDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitación válida',
    type: Invitacion 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invitación expirada o no disponible' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Código de invitación no válido' 
  })
  validarInvitacion(@Body() validarDto: ValidarInvitacionDto) {
    return this.contactoService.validarCodigoInvitacion(validarDto.codigo);
  }

  @Post('invitacion/:codigo/aceptar')
  @ApiOperation({ summary: 'Aceptar una invitación y crear la relación de contacto' })
  @ApiParam({ name: 'codigo', description: 'Código único de invitación' })
  @ApiQuery({ 
    name: 'usuarioId', 
    description: 'ID del usuario que acepta la invitación',
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitación aceptada y contactos creados exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El email no coincide o la invitación no está disponible' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Invitación o usuario no encontrado' 
  })
  aceptarInvitacion(
    @Param('codigo') codigo: string,
    @Query('usuarioId', ParseIntPipe) usuarioId: number
  ) {
    return this.contactoService.aceptarInvitacion(codigo, usuarioId);
  }

  @Delete('invitacion/:id')
  @ApiOperation({ summary: 'Cancelar una invitación pendiente' })
  @ApiParam({ name: 'id', description: 'ID de la invitación' })
  @ApiQuery({ 
    name: 'usuarioId', 
    description: 'ID del usuario que envió la invitación',
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Invitación cancelada exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Solo puedes cancelar invitaciones que enviaste o que estén pendientes' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Invitación no encontrada' 
  })
  cancelarInvitacion(
    @Param('id', ParseIntPipe) invitacionId: number,
    @Query('usuarioId', ParseIntPipe) usuarioId: number
  ) {
    return this.contactoService.cancelarInvitacion(invitacionId, usuarioId);
  }

  @Post('invitacion/generar-link/:usuarioId')
  @ApiOperation({ summary: 'Generar link/QR de invitación genérico para compartir' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario que genera el link' })
  @ApiResponse({ 
    status: 201, 
    description: 'Link de invitación generado exitosamente',
    type: Invitacion
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  generarLinkInvitacion(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.contactoService.generarLinkInvitacion(usuarioId);
  }
}
