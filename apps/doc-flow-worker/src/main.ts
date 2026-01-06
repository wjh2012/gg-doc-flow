import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocFlowWorkerModule } from './doc-flow-worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(DocFlowWorkerModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });
  await app.listen();
}
bootstrap();
