import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class GatewayService {
  constructor(private readonly jwtService: JwtService) {}

  async validateJwt(authHeader?: string): Promise<JwtPayload> {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
