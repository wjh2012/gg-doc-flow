import { NestFactory } from '@nestjs/core';
import { OcrWorkerModule } from './ocr-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(OcrWorkerModule);
}
bootstrap();
