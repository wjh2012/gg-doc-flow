import { Injectable } from '@nestjs/common';
import { DocFlowQueueProducer } from '../infra/message/doc-flow-queue.producer';

@Injectable()
export class TaskService {
  constructor(private readonly queueProducer: DocFlowQueueProducer) {}

  async publishTask() {
    await this.queueProducer.createDocument({
      docId: 'doc-123',
      userId: 'user-456',
    });
    console.log('Publishing task');
  }
}
