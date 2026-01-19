import { Body, Controller, Post } from '@nestjs/common';
import { GgAuthService } from './gg-auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class GgAuthController {
  constructor(private readonly ggAuthService: GgAuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.ggAuthService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.ggAuthService.login(loginDto.email, loginDto.password);
  }
}
