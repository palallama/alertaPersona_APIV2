import { Module } from '@nestjs/common';
import { UsuarioAdicionalService } from './usuario-adicional.service';
import { UsuarioAdicionalController } from './usuario-adicional.controller';

@Module({
  controllers: [UsuarioAdicionalController],
  providers: [UsuarioAdicionalService],
  exports: [UsuarioAdicionalService],
})
export class UsuarioAdicionalModule {}
