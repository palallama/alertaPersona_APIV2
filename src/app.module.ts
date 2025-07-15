import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsuarioModule } from './models/usuario/usuario.module';
import { AlertaModule } from './models/alerta/alerta.module';
import { AsistenteModule } from './models/asistente/asistente.module';
import { NotificacionModule } from './models/notificacion/notificacion.module';
import { UsuarioPreferenciaModule } from './models/usuario-preferencia/usuario-preferencia.module';
import { AppLoggerMiddleware } from './common/httpLoggerMiddleware';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './models/auth/auth.module';
import { MailModule } from './models/mail/mail.module';
import { SseController } from './models/sse/sse.controller';
import { FirebaseService } from './models/firebase/firebase.service';
import { UsuarioAdicionalService } from './models/usuario-adicional/usuario-adicional.service';
import { UsuarioAdicionalModule } from './models/usuario-adicional/usuario-adicional.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    PrismaModule,
    UsuarioModule,
    AlertaModule,
    AsistenteModule,
    NotificacionModule,
    UsuarioPreferenciaModule,
    AuthModule,
    MailModule,
    UsuarioAdicionalModule,
  ],
  controllers: [SseController],
  providers: [FirebaseService, UsuarioAdicionalService],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
