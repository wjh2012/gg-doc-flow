import {
  User,
  NewUser,
  UserUpdate,
} from '../infra/database/types/database.user.types';

export abstract class IUserRepository {
  abstract findUserById(id: number): Promise<User | undefined>;
  abstract createUser(data: NewUser): Promise<User>;
  abstract updateUser(id: number, data: UserUpdate): Promise<void>;
  abstract deleteUser(id: number): Promise<User | undefined>;
}
