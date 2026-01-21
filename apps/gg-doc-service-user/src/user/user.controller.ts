import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import type { CreateUserDto, UserWithPassword } from '@app/common-types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'find_user_by_email' })
  async findUserByEmail(
    @Payload() data: { email: string },
  ): Promise<UserWithPassword | null> {
    return this.userService.findUserByEmail(data.email);
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  async findUserById(
    @Payload() data: { id: number },
  ): Promise<UserWithPassword | null> {
    return this.userService.findUserById(data.id);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: CreateUserDto): Promise<UserWithPassword> {
    return this.userService.createUser(data);
  }
}
