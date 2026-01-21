import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GgGatewayService } from './gg-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
  ],
  providers: [GgGatewayService],
})
export class GgGatewayModule {}
