import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { Database, KYSELY_DB, NewUser, UserUpdate } from '@app/database';
import { Kysely } from 'kysely';
import type {
  CreateUserDto,
  UpdateUserDto,
  UserWithPassword,
} from '@app/common-types';

@Injectable()
export class KyselyUserRepository implements IUserRepository {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<Database>) {}

  async findUserById(id: number): Promise<UserWithPassword | undefined> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async createUser(data: CreateUserDto): Promise<UserWithPassword> {
    const dbData: NewUser = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      profile: data.profile,
    };
    return await this.db
      .insertInto('user')
      .values(dbData)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<void> {
    const dbData: UserUpdate = {};
    if (data.email !== undefined) dbData.email = data.email;
    if (data.password !== undefined) dbData.password = data.password;
    if (data.name !== undefined) dbData.name = data.name;
    if (data.role !== undefined) dbData.role = data.role;
    if (data.profile !== undefined) dbData.profile = data.profile;

    await this.db
      .updateTable('user')
      .set(dbData)
      .where('id', '=', id)
      .execute();
  }

  async deleteUser(id: number): Promise<UserWithPassword | undefined> {
    return this.db
      .deleteFrom('user')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }
}
