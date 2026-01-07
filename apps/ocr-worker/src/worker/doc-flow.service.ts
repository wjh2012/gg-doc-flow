import { Injectable, Inject } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/shared';
import { KYSELY_DB, WorkerDatabase, TaskStatus } from '@app/database';
import { Kysely } from 'kysely';

@Injectable()
export class DocFlowService {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<WorkerDatabase>) {}

  async createDocument(data: CreateDocJobPayload) {
    console.log('Processing document...', data);
    await this.updateJobStatus(data.docId, 'SUCCESS');
  }

  async updateJobStatus(id: string, status: TaskStatus) {
    await this.db
      .updateTable('task')
      .set({ status })
      .where('id', '=', id)
      .execute();
  }
}
