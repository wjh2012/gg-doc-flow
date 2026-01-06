import { Controller, Get } from '@nestjs/common';
import { DocFlowWorkerService } from './doc-flow-worker.service';

@Controller()
export class DocFlowWorkerController {
  constructor(private readonly docFlowWorkerService: DocFlowWorkerService) {}

  @Get()
  getHello(): string {
    return this.docFlowWorkerService.getHello();
  }
}
