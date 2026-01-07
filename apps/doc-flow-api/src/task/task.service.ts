import { Injectable } from '@nestjs/common';
import { DocFlowQueueProducer } from '../infra/message/doc-flow-queue.producer';
import { ITaskRepository } from './task.repository.interface';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly queueProducer: DocFlowQueueProducer,
  ) { }

  async publishTask() {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    await this.taskRepository.createTask({
      id: id,
      task_type: 'OCR',
      status: 'PENDING',
      created_at: now,
    });

    console.log('save task');

    await this.queueProducer.createDocument({
      docId: id,
      userId: 'user-456',
      createdAt: now,
    });

    console.log('Publishing task');
  }

  async getTasksLastHour() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.taskRepository.findTasksCreatedAfter(oneHourAgo);
  }

  async getRecentTasks(limit: number = 100) {
    return this.taskRepository.findRecentTasks(limit);
  }
}
