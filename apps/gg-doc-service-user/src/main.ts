import { NestFactory } from '@nestjs/core';
import { Logger } from '@app/common-logging';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
      },
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(Logger));
  await app.listen();
}
void bootstrap();
