import { initInstrumentation } from '@app/common-logging/otel/instrumentation';
initInstrumentation('gg-detection-worker');

import { NestFactory } from '@nestjs/core';
import { Logger } from '@app/common-logging';
import { GgDetectionWorkerModule } from './gg-detection-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    GgDetectionWorkerModule,
    { bufferLogs: true },
  );
  app.useLogger(app.get(Logger));
}
void bootstrap();
