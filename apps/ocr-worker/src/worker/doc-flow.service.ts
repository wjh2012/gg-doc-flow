import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/common-types';
import { KYSELY_DB, TaskStatus, WorkerDatabase } from '@app/database';
import { Kysely } from 'kysely';
import { ClientProxy } from '@nestjs/microservices';
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('ocr-worker');
const taskDurationHistogram = meter.createHistogram('task.duration', {
  description: 'Task duration from creation to completion',
  unit: 'ms',
});

@Injectable()
export class DocFlowService implements OnModuleInit {
  private readonly logger = new Logger(DocFlowService.name);

  constructor(
    @Inject(KYSELY_DB) protected readonly db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') protected readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      //
    }
  }

  async processTask(data: CreateDocJobPayload) {
    this.logger.log(data.docId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.updateJobStatus(data.docId, 'SUCCESS', data.createdAt);
  }

  private async updateJobStatus(
    id: string,
    status: TaskStatus,
    createdAt: string,
  ) {
    const finishedAt = new Date();
    const updatedTask = await this.db
      .updateTable('task')
      .set({ status, finished_at: finishedAt.toISOString() })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (updatedTask) {
      const duration = finishedAt.getTime() - new Date(createdAt).getTime();
      taskDurationHistogram.record(duration, {
        task_type: updatedTask.task_type,
        status: updatedTask.status,
      });

      this.client.emit('task_status_updates', updatedTask);
    }
  }
}
