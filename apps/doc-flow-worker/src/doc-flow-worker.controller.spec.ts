import { Test, TestingModule } from '@nestjs/testing';
import { DocFlowWorkerController } from './doc-flow-worker.controller';
import { DocFlowWorkerService } from './doc-flow-worker.service';

describe('DocFlowWorkerController', () => {
  let docFlowWorkerController: DocFlowWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DocFlowWorkerController],
      providers: [DocFlowWorkerService],
    }).compile();

    docFlowWorkerController = app.get<DocFlowWorkerController>(DocFlowWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(docFlowWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
