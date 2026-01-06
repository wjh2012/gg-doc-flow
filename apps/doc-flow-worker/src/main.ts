import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocFlowWorkerModule } from './doc-flow-worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(DocFlowWorkerModule, {
    transport: Transport.TCP,
  });
  await app.listen();
}
bootstrap();
