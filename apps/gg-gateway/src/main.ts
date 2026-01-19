import { NestFactory } from '@nestjs/core';
import { GgGatewayModule } from './gg-gateway.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    GgGatewayModule,
    new FastifyAdapter(),
  );
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN?.split(','),
    credentials: true,
  });
  await app.listen(process.env.port ?? 8080, '0.0.0.0');
}
void bootstrap();
