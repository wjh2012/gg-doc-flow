import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowWorker } from './doc-flow.worker';
import { DocFlowService } from './doc-flow.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    DatabaseModule,

    // microservice publisher
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),

    // job queue 명시적 선언
    BullModule.registerQueue({
      name: 'ocr-queue',
    }),
  ],
  providers: [DocFlowWorker, DocFlowService],
})
export class DocFlowModule {}
