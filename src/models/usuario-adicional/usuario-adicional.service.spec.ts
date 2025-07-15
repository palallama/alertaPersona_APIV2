import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioAdicionalService } from './usuario-adicional.service';

describe('UsuarioAdicionalService', () => {
  let service: UsuarioAdicionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioAdicionalService],
    }).compile();

    service = module.get<UsuarioAdicionalService>(UsuarioAdicionalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
