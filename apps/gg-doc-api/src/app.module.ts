import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DocModule } from './doc/doc.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [GatewayModule, AuthModule, DocModule],
})
export class AppModule {}
