import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonLoggerModule } from '@app/common-logging';

@Module({
  imports: [AuthModule, CommonLoggerModule],
})
export class AppModule {}
