import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DetectionWorker } from './detection.worker';
import { DetectionService } from './detection.service';
import { DatabaseModule } from '@app/database';
import { CommonQueueModule } from '@app/common-worker';
import { CommonLoggerModule } from '@app/common-logging';
import { CommonGrpcModule } from '@app/common-grpc';
import { QUEUE_NAMES } from '@app/common-types';

@Module({
  imports: [
    CommonQueueModule.register({
      name: QUEUE_NAMES.OBJECT_DETECTION,
    }),
    CommonLoggerModule,
    DatabaseModule,
    CommonGrpcModule.forDetection(),
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  providers: [DetectionWorker, DetectionService],
})
export class DetectionModule {}
