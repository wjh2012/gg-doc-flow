import { Controller } from '@nestjs/common';
import { DocFlowWorkerService } from './doc-flow-worker.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class DocFlowWorkerController {
  constructor(private readonly service: DocFlowWorkerService) {}

  @EventPattern('test_event')
  handleTestEvent(
    @Payload() data: { message: string; timestamp: number },
  ): void {
    console.log('--- [Worker] 데이터 수신 성공! ---');
    console.log('데이터:', data);

    this.service.processData(data);
  }
}
