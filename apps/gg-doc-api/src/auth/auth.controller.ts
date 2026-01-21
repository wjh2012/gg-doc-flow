import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return firstValueFrom(this.authClient.send({ cmd: 'signup' }, dto));
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return firstValueFrom(this.authClient.send({ cmd: 'login' }, dto));
  }
}
