import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6380,
      },
    }),
  ],
})
export class CommonQueueModule {
  static register(options: { name: string }): DynamicModule {
    console.log(`${options.name} registered`);
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
