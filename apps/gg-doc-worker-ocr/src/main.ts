import { initInstrumentation } from '@app/common-logging/otel/instrumentation';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@app/common-logging';
import { AppModule } from './app.module';

initInstrumentation('gg-doc-worker-ocr');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
}
void bootstrap();
