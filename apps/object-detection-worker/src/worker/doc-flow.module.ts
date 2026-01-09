import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocFlowWorker } from './doc-flow.worker';
import { DocFlowService } from './doc-flow.service';
import { DatabaseModule } from '@app/database';
import { CommonQueueModule } from '@app/common-worker';
import { CommonLoggerModule } from '@app/common-logging';
import { QUEUE_NAMES } from '@app/common-types';

@Module({
  imports: [
    CommonQueueModule.register({
      name: QUEUE_NAMES.OBJECT_DETECTION,
    }),
    CommonLoggerModule,
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
  ],
  providers: [DocFlowWorker, DocFlowService],
})
export class DocFlowModule {}
