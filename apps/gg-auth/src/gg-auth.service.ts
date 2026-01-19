import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import {
  AuthResponse,
  CreateUserDto,
  JwtPayload,
  UserWithPassword,
} from '@app/common-types';

@Injectable()
export class GgAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    const existingUser = await firstValueFrom<UserWithPassword | null>(
      this.userClient.send({ cmd: 'find_user_by_email' }, { email }),
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserDto: CreateUserDto = {
      email,
      password: hashedPassword,
      name,
      role: 'user',
      profile: { avatar_url: null, bio: null },
    };

    const user = await firstValueFrom<UserWithPassword | null>(
      this.userClient.send({ cmd: 'create_user' }, createUserDto),
    );

    if (!user) {
      throw new ConflictException('User already exists');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await firstValueFrom<UserWithPassword | null>(
      this.userClient.send({ cmd: 'find_user_by_email' }, { email }),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
