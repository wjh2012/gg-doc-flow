import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CommonLoggerModule } from '@app/common-logging';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6380,
      },
    }),
    CommonLoggerModule,
  ],
})
export class CommonQueueModule {
  static register(options: { name: string }): DynamicModule {
    return {
      module: CommonQueueModule,
      imports: [
        BullModule.registerQueue({
          name: options.name,
        }),
      ],
      exports: [BullModule],
    };
  }
}
