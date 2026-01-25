import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DocModule } from './doc/doc.module';
import { GatewayModule } from './gateway/gateway.module';
import { CommonLoggerModule } from '@app/common-logging';

@Module({
  imports: [GatewayModule, AuthModule, DocModule, CommonLoggerModule],
})
export class AppModule {}
