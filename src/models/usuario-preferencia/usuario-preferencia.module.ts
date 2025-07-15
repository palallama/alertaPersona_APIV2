import { Module } from '@nestjs/common';
import { UsuarioPreferenciaService } from './usuario-preferencia.service';
import { UsuarioPreferenciaController } from './usuario-preferencia.controller';

@Module({
  controllers: [UsuarioPreferenciaController],
  providers: [UsuarioPreferenciaService],
  exports: [UsuarioPreferenciaService],
})
export class UsuarioPreferenciaModule {}