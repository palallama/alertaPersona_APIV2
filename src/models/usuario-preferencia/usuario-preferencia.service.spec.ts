import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioPreferenciaService } from './usuario-preferencia.service';

describe('UsuarioPreferenciaService', () => {
  let service: UsuarioPreferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioPreferenciaService],
    }).compile();

    service = module.get<UsuarioPreferenciaService>(UsuarioPreferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
