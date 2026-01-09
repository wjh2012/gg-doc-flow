import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { Database, KYSELY_DB, NewUser, User, UserUpdate } from '@app/database';
import { Kysely } from 'kysely';

@Injectable()
export class KyselyUserRepository implements IUserRepository {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<Database>) {}

  async findUserById(id: number): Promise<User | undefined> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createUser(data: NewUser): Promise<User> {
    return await this.db
      .insertInto('user')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateUser(id: number, data: UserUpdate): Promise<void> {
    await this.db.updateTable('user').set(data).where('id', '=', id).execute();
  }

  async deleteUser(id: number): Promise<User | undefined> {
    return this.db
      .deleteFrom('user')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }
}
