import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CambioContrasenaDto } from './dto/cambio-contrasena.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResetearContrasenaDto, SolicitarCodigoDto, VerificarCodigoDto } from './dto/verificar-codigo.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('crearUsuario')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.crearUsuario(createUsuarioDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mail: { type: 'string', example: 'usuario@correo.com' },
        password: { type: 'string', example: '12345678' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso con token JWT',
  })
  login(@Body() signInDto: Record<string, any>) {
    return this.authService.validateUser(signInDto.mail, signInDto.password);
  }

  @Post('loginAdmin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mail: { type: 'string', example: 'usuario@correo.com' },
        password: { type: 'string', example: '12345678' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso con token JWT',
  })
  async loginAdmin(@Body() signInDto: Record<string, any>) {
    return this.authService.validateUser(signInDto.mail, signInDto.password, true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario JWT' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('cambiar-contrasena')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada con éxito' })
  cambiarContrasena(
    @Request() req,
    @Body() cambioContrasenaDto: CambioContrasenaDto,
  ) {
    return this.authService.cambiarContrasena(
      req.user.id,
      cambioContrasenaDto.contrasenaActual,
      cambioContrasenaDto.nuevaContrasena,
    );
  }

  
  @Post('solicitar-codigo')
  @ApiOperation({ summary: 'Solicitar código de recuperación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Código enviado al correo electrónico',
    schema: {
      example: { message: 'Código de recuperación enviado al email' }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({ type: SolicitarCodigoDto })
  async solicitarCodigo(@Body('email') email: string) {
    return this.authService.generarCodigoRecuperacion(email);
  }

  
  @Post('verificar-codigo')
  @ApiOperation({ summary: 'Verificar código de recuperación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resultado de la verificación',
    schema: {
      example: { valido: true }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({ type: VerificarCodigoDto })
  async verificarCodigo(@Body() verificarCodigoDto: VerificarCodigoDto) {
    return this.authService.verificarCodigoRecuperacion(
      verificarCodigoDto.email,
      verificarCodigoDto.codigo,
    );
  }

  @Post('resetear-contrasena')
  @ApiOperation({ summary: 'Restablecer contraseña con código' })
  @ApiResponse({ 
    status: 200, 
    description: 'Contraseña actualizada correctamente',
    schema: {
      example: { message: 'Contraseña actualizada correctamente' }
    }
  })
  @ApiResponse({ status: 404, description: 'Código inválido o expirado' })
  @ApiBody({ type: ResetearContrasenaDto })
  async resetearContrasena(
    @Body('email') email: string,
    @Body('codigo') codigo: string,
    @Body('nuevaContrasena') nuevaContrasena: string,
  ) {
    return this.authService.cambiarContrasenaConCodigo(
      email,
      codigo,
      nuevaContrasena,
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar access token usando refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Nuevo access token generado exitosamente',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }
}