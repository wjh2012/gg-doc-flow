import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowQueueProducer } from './doc-flow-queue.producer';
import { QUEUE_NAMES } from '@app/common-types';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: QUEUE_NAMES.OCR,
      },
      {
        name: QUEUE_NAMES.OBJECT_DETECTION,
      },
    ),
  ],
  providers: [DocFlowQueueProducer],
  exports: [DocFlowQueueProducer],
})
export class DocFlowQueueModule {}
