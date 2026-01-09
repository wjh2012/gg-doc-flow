import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

export abstract class BaseWorkerHost<T = any> extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name);

  async process(job: Job<T, any, string>): Promise<any> {
    return this.handle(job.data);
  }

  abstract handle(data: T): Promise<void>;

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job active ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job completed ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: any) {
    this.logger.error(`Job failed ${job.id}`, err);
  }

  @OnWorkerEvent('error')
  onError(err: any) {
    this.logger.error(`Job error`, err);
  }
}
