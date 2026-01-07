import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowWorker } from './doc-flow.worker';
import { DocFlowService } from './doc-flow.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'doc-flow',
    }),
  ],
  providers: [DocFlowWorker, DocFlowService],
})
export class DocFlowModule {}
