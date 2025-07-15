import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          // host: config.get('MAIL_HOST'),
          service: 'gmail',
          secure: false,
          auth: {
            user: "julian.torossian@davinci.edu.ar", // config.get('MAIL_USER'),
            pass: "phrh uolq qiqf pzxm", // config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <julian.torossian@davinci.edu.ar>`//`"No Reply" <${config.get('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
