import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioPreferenciaController } from './usuario-preferencia.controller';
import { UsuarioPreferenciaService } from './usuario-preferencia.service';

describe('UsuarioPreferenciaController', () => {
  let controller: UsuarioPreferenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioPreferenciaController],
      providers: [UsuarioPreferenciaService],
    }).compile();

    controller = module.get<UsuarioPreferenciaController>(UsuarioPreferenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
