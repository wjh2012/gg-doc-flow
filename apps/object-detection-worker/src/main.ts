import { initInstrumentation } from '@app/common-logging/otel/instrumentation';
initInstrumentation('object-detection-worker');

import { NestFactory } from '@nestjs/core';
import { ObjectDetectionWorkerModule } from './object-detection-worker.module';
import { Logger } from '@app/common-logging';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    ObjectDetectionWorkerModule,
    { bufferLogs: true },
  );
  app.useLogger(app.get(Logger));
}
bootstrap();
