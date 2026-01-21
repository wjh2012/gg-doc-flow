import { DocFlowService } from './doc-flow.service';
import { CreateDocJobPayload, QUEUE_NAMES } from '@app/common-types';
import { BaseWorkerHost, WorkerProcessor } from '@app/common-worker';

@WorkerProcessor(QUEUE_NAMES.OCR)
export class DocFlowWorker extends BaseWorkerHost<CreateDocJobPayload> {
  constructor(private readonly docFlowService: DocFlowService) {
    super();
  }

  async handle(data: CreateDocJobPayload) {
    await this.docFlowService.processTask(data);
  }
}
