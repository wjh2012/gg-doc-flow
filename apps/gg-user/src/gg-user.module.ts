import { Module } from '@nestjs/common';
import { GgUserController } from './gg-user.controller';
import { GgUserService } from './gg-user.service';
import { DatabaseModule } from '@app/database';
import { IUserRepository } from './user/user.repository.interface';
import { KyselyUserRepository } from './user/infra/kysely.user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [GgUserController],
  providers: [
    GgUserService,
    {
      provide: IUserRepository,
      useClass: KyselyUserRepository,
    },
  ],
})
export class GgUserModule {}
