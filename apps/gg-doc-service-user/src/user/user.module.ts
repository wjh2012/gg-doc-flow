import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IUserRepository } from './user.repository.interface';
import { KyselyUserRepository } from './infra/kysely.user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: KyselyUserRepository,
    },
  ],
})
export class UserModule {}
