import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDocJobPayload } from '@app/shared';
import { KYSELY_DB, WorkerDatabase, TaskStatus } from '@app/database';
import { Kysely } from 'kysely';

@Injectable()
export class DocFlowService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createDocument(data: CreateDocJobPayload) {
    console.log('Processing document...', data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.updateJobStatus(data.docId, 'SUCCESS');
  }

  async updateJobStatus(id: string, status: TaskStatus) {
    const updatedTask = await this.db
      .updateTable('task')
      .set({ status })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (updatedTask) {
      this.client.emit('task_status_updates', updatedTask);
    }
  }
}
