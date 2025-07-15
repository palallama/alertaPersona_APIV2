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
}
