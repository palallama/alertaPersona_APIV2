import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { usuario } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
  
    async recuperoPassword(usuario: usuario, codigoRecupero: string) {
      await this.mailerService.sendMail({
        to: usuario.mail,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Recupera tu contraseña 🔑',
        template: 'recupero',
        context: {
          codigo: codigoRecupero
        },
      });
    }

    async enviarInvitacionContacto(
      email: string, 
      datos: {
        nombreRemitente: string;
        mensaje?: string;
        link: string;
        codigo: string;
      }
    ) {
      await this.mailerService.sendMail({
        to: email,
        subject: `${datos.nombreRemitente} te invita a unirte a AlertaPersona 👥`,
        template: 'invitacion',
        context: {
          nombreRemitente: datos.nombreRemitente,
          mensaje: datos.mensaje,
          link: datos.link,
          codigo: datos.codigo
        },
      });
    }
}
