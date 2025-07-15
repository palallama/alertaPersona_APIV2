import { Test, TestingModule } from '@nestjs/testing';
import { AsistenteController } from './asistente.controller';
import { AsistenteService } from './asistente.service';

describe('AsistenteController', () => {
  let controller: AsistenteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsistenteController],
      providers: [AsistenteService],
    }).compile();

    controller = module.get<AsistenteController>(AsistenteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
