import { Injectable } from '@nestjs/common';
import { DocFlowQueueProducer } from '../infra/message/doc-flow-queue.producer';
import { ITaskRepository } from './task.repository.interface';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskType } from '@app/database';

export interface TaskStatusEvent {
  data: any;
}

@Injectable()
export class TaskService {
  private taskStatusSubject = new Subject<any>();

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly queueProducer: DocFlowQueueProducer,
  ) {}

  broadcastTaskStatus(task: any) {
    this.taskStatusSubject.next(task);
  }

  async publishTask(type: TaskType = 'OCR') {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const task = await this.taskRepository.createTask({
      id: id,
      task_type: type,
      status: 'PENDING',
      created_at: now,
    });

    this.broadcastTaskStatus(task);

    console.log(`save task [${type}]`);

    if (type === 'OCR') {
      await this.queueProducer.createOcrTask({
        docId: id,
        userId: 'user-456',
        createdAt: now,
      });
      console.log('Publishing OCR task');
    } else if (type === 'DETECTION') {
      await this.queueProducer.createDetectionTask({
        docId: id,
        userId: 'user-456',
        createdAt: now,
      });
      console.log('Publishing DETECTION task');
    }
  }

  async getTasksLastHour() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.taskRepository.findTasksCreatedAfter(oneHourAgo);
  }

  async getRecentTasks(limit: number = 100) {
    return this.taskRepository.findRecentTasks(limit);
  }

  getTaskStatusStream(): Observable<TaskStatusEvent> {
    return this.taskStatusSubject
      .asObservable()
      .pipe(map((task) => ({ data: task })));
  }
}
