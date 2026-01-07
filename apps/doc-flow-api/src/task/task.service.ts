import { Injectable } from '@nestjs/common';
import { DocFlowQueueProducer } from '../infra/message/doc-flow-queue.producer';
import { ITaskRepository } from './task.repository.interface';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly queueProducer: DocFlowQueueProducer,
  ) {}

  async publishTask() {
    const now = new Date().toISOString();

    await this.taskRepository.createTask({
      id: crypto.randomUUID(),
      task_type: 'OCR',
      status: 'PENDING',
      created_at: now,
    });
    console.log('save task');

    await this.queueProducer.createDocument({
      docId: 'doc-123',
      userId: 'user-456',
      createdAt: now,
    });

    console.log('Publishing task');
  }
}
