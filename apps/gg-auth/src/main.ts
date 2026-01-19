import { NestFactory } from '@nestjs/core';
import { GgAuthModule } from './gg-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(GgAuthModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
