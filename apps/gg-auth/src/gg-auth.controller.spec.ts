import { Test, TestingModule } from '@nestjs/testing';
import { GgAuthController } from './gg-auth.controller';
import { GgAuthService } from './gg-auth.service';

describe('GgAuthController', () => {
  let ggAuthController: GgAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GgAuthController],
      providers: [GgAuthService],
    }).compile();

    ggAuthController = app.get<GgAuthController>(GgAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ggAuthController.getHello()).toBe('Hello World!');
    });
  });
});
