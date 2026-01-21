import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CommonQueueModule } from '@app/common-worker';
import { CommonLoggerModule } from '@app/common-logging';
import { DetectionModule } from './detection/detection.module';

@Module({
  imports: [
    CommonLoggerModule.forRoot(),
    CommonQueueModule,
    DatabaseModule,
    DetectionModule,
  ],
})
export class AppModule {}
