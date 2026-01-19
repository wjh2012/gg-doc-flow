import { Controller } from '@nestjs/common';
import { GgUserService } from './gg-user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateUserDto, UserWithPassword } from '@app/common-types';

@Controller()
export class GgUserController {
  constructor(private readonly ggUserService: GgUserService) {}

  @MessagePattern({ cmd: 'find_user_by_email' })
  async findUserByEmail(
    @Payload() data: { email: string },
  ): Promise<UserWithPassword | null> {
    return this.ggUserService.findUserByEmail(data.email);
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  async findUserById(
    @Payload() data: { id: number },
  ): Promise<UserWithPassword | null> {
    return this.ggUserService.findUserById(data.id);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: CreateUserDto): Promise<UserWithPassword> {
    return this.ggUserService.createUser(data);
  }
}
