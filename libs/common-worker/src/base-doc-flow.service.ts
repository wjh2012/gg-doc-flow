import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Kysely } from 'kysely';
import { CreateDocJobPayload } from '@app/common-types';
import { KYSELY_DB, TaskStatus, WorkerDatabase } from '@app/database';

export abstract class BaseDocFlowService implements OnModuleInit {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(KYSELY_DB) protected readonly db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') protected readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch {
      this.logger.warn('TASK_SERVICE 연결 실패');
    }
  }

  async processTask(data: CreateDocJobPayload) {
    this.logger.log(`작업 시작: ${data.docId}`);

    try {
      await this.updateJobStatus(data.docId, 'PROCESSING');
      await this.executeTask(data);
      await this.updateJobStatus(data.docId, 'SUCCESS');
    } catch (error) {
      this.logger.error(`작업 실패: ${data.docId}`, error);
      await this.updateJobStatus(data.docId, 'FAILED');
      throw error;
    }
  }

  protected abstract executeTask(data: CreateDocJobPayload): Promise<void>;

  protected async updateJobStatus(id: string, status: TaskStatus) {
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
