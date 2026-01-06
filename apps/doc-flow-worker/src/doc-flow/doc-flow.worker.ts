import { Processor, WorkerHost } from '@nestjs/bullmq';
import { DocFlowService } from './doc-flow.service';
import { CreateDocJobPayload } from '../../../doc-flow-api/src/infra/message/doc-flow-queue.producer';
import { Job } from 'bullmq';

@Processor('doc-flow')
export class DocFlowWorker extends WorkerHost {
  constructor(private readonly docFlowService: DocFlowService) {
    super();
  }

  async process(job: Job<CreateDocJobPayload>) {
    await this.docFlowService.createDocument(job.data);
    console.log('Created doc job');
  }
}
