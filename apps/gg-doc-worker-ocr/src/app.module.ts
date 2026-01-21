import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CommonQueueModule } from '@app/common-worker';
import { CommonLoggerModule } from '@app/common-logging';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [
    CommonLoggerModule.forRoot(),
    CommonQueueModule,
    DatabaseModule,
    OcrModule,
  ],
})
export class AppModule {}
