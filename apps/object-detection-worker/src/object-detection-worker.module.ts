import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { DocFlowModule } from './worker/doc-flow.module';
import { CommonQueueModule } from '@app/common-worker';

@Module({
  imports: [CommonQueueModule, DatabaseModule, DocFlowModule],
})
export class ObjectDetectionWorkerModule {}
