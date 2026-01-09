import { NestFactory } from '@nestjs/core';
import { ObjectDetectionWorkerModule } from './object-detection-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    ObjectDetectionWorkerModule,
  );
}
bootstrap();
