import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonLoggerModule } from '@app/common-logging';

@Module({
  imports: [UserModule, CommonLoggerModule],
})
export class AppModule {}
