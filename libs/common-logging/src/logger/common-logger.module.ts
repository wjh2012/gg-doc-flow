import { Global, Module, DynamicModule } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';

const defaultConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

@Global()
@Module({})
export class CommonLoggerModule {
  static forRoot(config?: Params): DynamicModule {
    return {
      module: CommonLoggerModule,
      imports: [LoggerModule.forRoot(config ?? defaultConfig)],
      exports: [LoggerModule],
    };
  }
}
