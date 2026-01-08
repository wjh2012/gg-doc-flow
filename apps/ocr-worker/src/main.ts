import { NestFactory } from '@nestjs/core';
import { OcrWorkerModule } from './ocr-worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(OcrWorkerModule);
}
bootstrap();
