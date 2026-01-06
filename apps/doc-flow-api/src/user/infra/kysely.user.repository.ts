import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { KYSELY_DB } from '../../infra/database/kysely.provider';
import { Kysely } from 'kysely';
import { Database } from '../../infra/database/types/database.types';
import {
  NewUser,
  User,
  UserUpdate,
} from '../../infra/database/types/database.user.types';

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
