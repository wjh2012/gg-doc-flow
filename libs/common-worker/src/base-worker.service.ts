import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { KYSELY_DB, WorkerDatabase, TaskStatus } from '@app/database';
import { Kysely } from 'kysely';

@Injectable()
export abstract class BaseWorkerService {
  constructor(
    @Inject(KYSELY_DB) protected readonly db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') protected readonly client: ClientProxy,
  ) {}

  async updateJobStatus(id: string, status: TaskStatus) {
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

  abstract processTask(data: any): Promise<void>;
}
