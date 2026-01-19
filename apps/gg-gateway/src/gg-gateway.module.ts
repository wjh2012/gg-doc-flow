import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GgGatewayService } from './gg-gateway.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [GgGatewayService],
})
export class GgGatewayModule {}
