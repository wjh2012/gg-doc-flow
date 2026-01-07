import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../task.repository.interface';
import { KYSELY_DB, Database, NewTask, Task, TaskUpdate } from '@app/database';
import { Kysely } from 'kysely';

@Injectable()
export class KyselyTaskRepository implements ITaskRepository {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<Database>) { }

  async findTaskById(id: string): Promise<Task | undefined> {
    return await this.db
      .selectFrom('task')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createTask(data: NewTask): Promise<Task> {
    return await this.db
      .insertInto('task')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateTask(id: string, data: TaskUpdate): Promise<void> {
    await this.db.updateTable('task').set(data).where('id', '=', id).execute();
  }

  async deleteTask(id: string): Promise<Task | undefined> {
    return this.db
      .deleteFrom('task')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }
}
