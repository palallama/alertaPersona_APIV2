import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.model';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioAdicionalModule } from '../usuario-adicional/usuario-adicional.module';
import { ContactoModule } from '../contacto/contacto.module';

@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
    UsuarioModule,
    UsuarioAdicionalModule,
    ContactoModule,
  ],
  controllers: [AlertaController],
  providers: [AlertaService],
  exports: [AlertaService],
})
export class AlertaModule {}