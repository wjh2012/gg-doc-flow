import { DocFlowService } from './doc-flow.service';
import { CreateDocJobPayload, QUEUE_NAMES } from '@app/common-types';
import { BaseWorkerHost, WorkerProcessor } from '@app/common-worker';

@WorkerProcessor(QUEUE_NAMES.OBJECT_DETECTION)
export class DocFlowWorker extends BaseWorkerHost<CreateDocJobPayload> {
  protected readonly queueName = QUEUE_NAMES.OBJECT_DETECTION;

  constructor(private readonly docFlowService: DocFlowService) {
    super();
  }

  async handle(data: CreateDocJobPayload) {
    await this.docFlowService.processTask(data);
  }
}
