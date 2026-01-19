import type {
  CreateUserDto,
  UpdateUserDto,
  UserWithPassword,
} from '@app/common-types';

export abstract class IUserRepository {
  abstract findUserById(id: number): Promise<UserWithPassword | undefined>;
  abstract findUserByEmail(
    email: string,
  ): Promise<UserWithPassword | undefined>;
  abstract createUser(data: CreateUserDto): Promise<UserWithPassword>;
  abstract updateUser(id: number, data: UpdateUserDto): Promise<void>;
  abstract deleteUser(id: number): Promise<UserWithPassword | undefined>;
}
