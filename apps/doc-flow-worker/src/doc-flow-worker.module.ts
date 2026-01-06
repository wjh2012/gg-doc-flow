import { Module } from '@nestjs/common';
import { DocFlowWorkerController } from './doc-flow-worker.controller';
import { DocFlowWorkerService } from './doc-flow-worker.service';

@Module({
  imports: [],
  controllers: [DocFlowWorkerController],
  providers: [DocFlowWorkerService],
})
export class DocFlowWorkerModule {}
