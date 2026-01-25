import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DetectionGrpcClient } from './detection-grpc.client';

export interface DetectionClientModuleOptions {
    url?: string;
}

@Module({})
export class DetectionClientModule {
    static register(options: DetectionClientModuleOptions = {}): DynamicModule {
        return {
            module: DetectionClientModule,
            imports: [
                ClientsModule.register([
                    {
                        name: 'DETECTION_PACKAGE',
                        transport: Transport.GRPC,
                        options: {
                            package: 'detection',
                            protoPath: join(__dirname, 'proto/detection.proto'),
                            url: options.url || process.env.DETECTION_GRPC_URL || 'localhost:50052',
                        },
                    },
                ]),
            ],
            providers: [DetectionGrpcClient],
            exports: [DetectionGrpcClient],
        };
    }
}
