import { initInstrumentation } from '@app/common-logging/otel/instrumentation';
initInstrumentation('ocr-worker');

import { NestFactory } from '@nestjs/core';
import { OcrWorkerModule } from './ocr-worker.module';
import { Logger } from '@app/common-logging';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(OcrWorkerModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
}
bootstrap();
