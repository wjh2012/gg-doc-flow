import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { DocFlowModule } from './worker/doc-flow.module';
import { CommonQueueModule } from '@app/common-worker';
import { CommonLoggerModule } from '@app/common-logging';

@Module({
  imports: [
    CommonLoggerModule.forRoot(),
    CommonQueueModule,
    DatabaseModule,
    DocFlowModule,
  ],
})
export class GgDetectionWorkerModule {}
