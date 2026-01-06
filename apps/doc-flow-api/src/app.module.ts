import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { DocFlowQueueModule } from './infra/message/doc-flow-queue.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register(),
    ClientsModule.register([
      {
        name: 'hello_tcp',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
    ]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    DocFlowQueueModule,
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
