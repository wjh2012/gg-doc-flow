import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class GgAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signup(email: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return { message: 'User created successfully' };
  }

  async login(email: string, pass: string) {
    const user = {
      id: '12345',
      email: 'test@example.com',
      password: 'hashed_password_from_db',
      role: 'user',
    };

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
