import { NestFactory } from '@nestjs/core';
import { GgAuthModule } from './gg-auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(GgAuthModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3001, '0.0.0.0');
}
void bootstrap();
