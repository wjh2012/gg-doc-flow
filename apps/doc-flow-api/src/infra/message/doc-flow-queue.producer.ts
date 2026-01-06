import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

export interface CreateDocJobPayload {
  docId: string;
  userId: string;
}

@Injectable()
export class DocFlowQueueProducer {
  constructor(
    @InjectQueue('doc-flow')
    private readonly queue: Queue,
  ) {}

  async createDocument(payload: CreateDocJobPayload) {
    await this.queue.add('create_document', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
    });
  }
}
