import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowWorkerController } from './doc-flow-worker.controller';
import { DocFlowWorkerService } from './doc-flow-worker.service';
import { DocFlowModule } from './doc-flow/doc-flow.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    DocFlowModule,
  ],
  controllers: [DocFlowWorkerController],
  providers: [DocFlowWorkerService],
})
export class DocFlowWorkerModule {}
