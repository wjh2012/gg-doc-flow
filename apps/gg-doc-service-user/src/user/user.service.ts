import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import type { CreateUserDto, UserWithPassword } from '@app/common-types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.userRepository.findUserByEmail(email);
    return user ?? null;
  }

  async findUserById(id: number): Promise<UserWithPassword | null> {
    const user = await this.userRepository.findUserById(id);
    return user ?? null;
  }

  async createUser(data: CreateUserDto): Promise<UserWithPassword> {
    return this.userRepository.createUser(data);
  }
}
