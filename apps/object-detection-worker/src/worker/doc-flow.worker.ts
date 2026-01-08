import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { DocFlowService } from './doc-flow.service';
import { Job } from 'bullmq';
import { CreateDocJobPayload } from '@app/common-types';

@Processor('obd-queue')
export class DocFlowWorker extends WorkerHost {
  constructor(private readonly docFlowService: DocFlowService) {
    super();
  }

  async process(job: Job<CreateDocJobPayload>) {
    await this.docFlowService.processTask(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job active ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job completed ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: any) {
    console.log(`Job failed ${job.id}`, err);
  }

  @OnWorkerEvent('error')
  onError(err: any) {
    console.log(`Job error`, err);
  }
}
