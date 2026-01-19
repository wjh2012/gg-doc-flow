import { Controller, Get } from '@nestjs/common';
import { GgAuthService } from './gg-auth.service';

@Controller()
export class GgAuthController {
  constructor(private readonly ggAuthService: GgAuthService) {}

  @Get()
  getHello(): string {
    return this.ggAuthService.getHello();
  }
}
