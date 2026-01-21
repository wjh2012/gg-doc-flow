import { initInstrumentation } from '@app/common-logging/otel/instrumentation';
initInstrumentation('gg-ocr-worker');

import { NestFactory } from '@nestjs/core';
import { Logger } from '@app/common-logging';
import { GgOcrWorkerModule } from './gg-ocr-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(GgOcrWorkerModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
}
void bootstrap();
