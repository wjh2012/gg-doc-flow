import { Injectable, Inject } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/shared';
import { KYSELY_DB, WorkerDatabase, TaskStatus } from '@app/database';
import { Kysely } from 'kysely';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class DocFlowService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<WorkerDatabase>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createDocument(data: CreateDocJobPayload) {
    console.log('Processing document...', data);
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
      await this.cacheManager.set(`task:${id}`, updatedTask);
    }
  }
}
