import { Module } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { MailModule } from '../mail/mail.module';
import { UsuarioAdicionalModule } from '../usuario-adicional/usuario-adicional.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [MailModule, UsuarioAdicionalModule, FirebaseModule],
  controllers: [ContactoController],
  providers: [ContactoService],
  exports: [ContactoService],
})
export class ContactoModule {}
