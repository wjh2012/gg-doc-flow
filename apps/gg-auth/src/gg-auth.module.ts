import { Module } from '@nestjs/common';
import { GgAuthController } from './gg-auth.controller';
import { GgAuthService } from './gg-auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GgAuthController],
  providers: [GgAuthService],
})
export class GgAuthModule {}
