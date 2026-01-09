import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/common-types';
import { KYSELY_DB, TaskStatus, WorkerDatabase } from '@app/database';
import { Kysely } from 'kysely';
import { ClientProxy } from '@nestjs/microservices';

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
      this.client.emit('task_status_updates', updatedTask);
    }
  }
}
