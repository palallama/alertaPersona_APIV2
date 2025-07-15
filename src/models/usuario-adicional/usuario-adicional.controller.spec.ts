import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioAdicionalController } from './usuario-adicional.controller';
import { UsuarioAdicionalService } from './usuario-adicional.service';

describe('UsuarioAdicionalController', () => {
  let controller: UsuarioAdicionalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioAdicionalController],
      providers: [UsuarioAdicionalService],
    }).compile();

    controller = module.get<UsuarioAdicionalController>(UsuarioAdicionalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
