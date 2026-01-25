import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OcrWorker } from './ocr.worker';
import { OcrService } from './ocr.service';
import { DatabaseModule } from '@app/database';
import { CommonQueueModule, QUEUE_NAMES } from '@app/common-worker';
import { CommonLoggerModule } from '@app/common-logging';
import { OcrClientModule } from '@app/ocr-client';

@Module({
  imports: [
    CommonQueueModule.register({
      name: QUEUE_NAMES.OCR,
    }),
    CommonLoggerModule,
    DatabaseModule,
    OcrClientModule.register(),
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  providers: [OcrWorker, OcrService],
})
export class OcrModule {}
