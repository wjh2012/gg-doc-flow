import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../task.repository.interface';
import { KYSELY_DB, Database, NewTask, Task, TaskUpdate } from '@app/database';
import { Kysely } from 'kysely';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class KyselyTaskCacheRepository implements ITaskRepository {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<Database>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findTaskById(id: string): Promise<Task | undefined> {
    const cacheKey = `task:${id}`;
    const cachedTask = await this.cacheManager.get<Task>(cacheKey);

    if (cachedTask) {
      return cachedTask;
    }

    const task = await this.db
      .selectFrom('task')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (task) {
      await this.cacheManager.set(cacheKey, task);
    }

    return task;
  }

  async createTask(data: NewTask): Promise<Task> {
    const task = await this.db
      .insertInto('task')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();

    await this.cacheManager.set(`task:${task.id}`, task);

    return task;
  }

  async updateTask(id: string, data: TaskUpdate): Promise<void> {
    await this.db.updateTable('task').set(data).where('id', '=', id).execute();
    await this.cacheManager.del(`task:${id}`);
  }

  async deleteTask(id: string): Promise<Task | undefined> {
    const deletedTask = await this.db
      .deleteFrom('task')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (deletedTask) {
      await this.cacheManager.del(`task:${id}`);
    }

    return deletedTask;
  }

  async findTasksCreatedAfter(date: Date): Promise<Task[]> {
    return await this.db
      .selectFrom('task')
      .selectAll()
      .where('created_at', '>', date)
      .execute();
  }

  async findRecentTasks(limit: number): Promise<Task[]> {
    return await this.db
      .selectFrom('task')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .execute();
  }
}
