import { NestFactory } from '@nestjs/core';
import { OcrWorkerModule } from './ocr-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(OcrWorkerModule);

  const shutdown = async () => {
    try {
      await app.close();
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => {
    void shutdown();
  });

  process.on('SIGINT', () => {
    void shutdown();
  });

  console.log('Worker started');

  setInterval(() => {}, 1000 * 60 * 60);
}

bootstrap();
