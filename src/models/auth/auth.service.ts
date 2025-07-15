import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { UsuarioAdicionalService } from '../usuario-adicional/usuario-adicional.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private usuarioAdicionalService: UsuarioAdicionalService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) { }
  private readonly logger = new Logger('AuthService');

  async crearUsuario(createUsuarioDto: CreateUsuarioDto) {
    
    const existe = await this.usuarioService.findByEmail(createUsuarioDto.mail);
    if (existe) {
      throw new UnauthorizedException('El email ya está registrado');
    }

    return await this.usuarioService.create(createUsuarioDto);
  }

  async validateUser(email: string, pass: string): Promise<any> {

    const user = await this.usuarioService.loginUser(email);

    if (!user) {
      this.logger.warn('User not found');
      throw new UnauthorizedException("Usuario no encontrado");
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      this.logger.warn('Password mismatch');
      throw new UnauthorizedException("Contraseña incorrecta");
    }

    const payload = { sub: user.id, username: user.nombre, email: user.mail };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async cambiarContrasena(usuarioId: number, contrasenaActual: string, nuevaContrasena: string) {
    const usuario = await this.usuarioService.findOne(usuarioId);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const esValida = await bcrypt.compare(contrasenaActual, usuario.password);
    if (!esValida) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    await this.usuarioService.actualizarContrasena(usuarioId, hashedPassword);

    return {
      message: 'Contraseña actualizada correctamente',
      // Opcional: generar nuevo token
      access_token: this.jwtService.sign({
        email: usuario.mail,
        sub: usuario.id
      })
    };
  }

  async generarCodigoRecuperacion(email: string) {
    const user = await this.usuarioService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de expiración

    let tiene = await this.usuarioAdicionalService.findOne(user.id, "codigoRecupero");
    if (tiene) {
      // Si el código ya existe, eliminarlo
      await this.usuarioAdicionalService.remove(user.id, "codigoRecupero");
    }

    await this.usuarioAdicionalService.create({
      usuarioId: user.id,
      clave: "codigoRecupero",
      valor: codigo, 
    });

    // Enviar email con el código
    await this.mailService.recuperoPassword(user, codigo);

    return { message: 'Código de recuperación enviado al email' };
  }

  async verificarCodigoRecuperacion(email: string, codigo: string) {
    const user = await this.usuarioService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const adicional = await this.usuarioAdicionalService.findOne(user.id, "codigoRecupero")

    // Validar código
    if (!adicional || adicional.valor !== codigo) {
      return { valido: false };
    }

    return { valido: true };
  }


  async cambiarContrasenaConCodigo(
    email: string, 
    codigo: string, 
    nuevaContrasena: string
  ) {
    const user = await this.usuarioService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const adicional = await this.usuarioAdicionalService.findOne(user.id, "codigoRecupero")
    this.logger.log(adicional);

    // Validar código
    if (!adicional || adicional.valor !== codigo) {
      throw new NotFoundException('Código inválido o expirado');
    }

    // Cambiar contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    await this.usuarioService.actualizarContrasena(user.id, hashedPassword);

    // Limpiar código usado
    await this.usuarioAdicionalService.remove(adicional.usuarioId, adicional.clave);

    return { message: 'Contraseña actualizada correctamente' };
  }
}