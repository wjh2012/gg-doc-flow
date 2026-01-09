import { Inject, Injectable } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/common-types';
import { KYSELY_DB, TaskStatus, WorkerDatabase } from '@app/database';
import { Kysely } from 'kysely';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocFlowService {
  constructor(
    @Inject(KYSELY_DB) protected readonly db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') protected readonly client: ClientProxy,
  ) {}

  async processTask(data: CreateDocJobPayload) {
    console.log('Processing document...', data);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.updateJobStatus(data.docId, 'SUCCESS');
  }

  private async updateJobStatus(id: string, status: TaskStatus) {
    const updatedTask = await this.db
      .updateTable('task')
      .set({ status })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (updatedTask) {
      console.log(`Task ${id} updated to ${status}`);
      this.client.emit('task_status_updates', updatedTask);
    }
  }
}
